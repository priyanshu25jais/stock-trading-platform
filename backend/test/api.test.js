const { test, describe, before, after } = require("node:test");
const assert = require("node:assert/strict");

const { createApp } = require("../app");
const { createMemoryStore } = require("../store/memoryStore");
const { getQuote } = require("../data/market");
const { OPENING_BALANCE } = require("../data/seed");

// Freeze the simulated market so prices are predictable in tests.
const FIXED_NOW = Date.UTC(2026, 9, 20, 6, 0, 0);
const clock = () => FIXED_NOW;

let server;
let base;

async function startServer() {
  const store = createMemoryStore();
  const app = createApp(store, { clock });
  await app.locals.trading.seedIfEmpty();
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  base = `http://127.0.0.1:${server.address().port}`;
}

async function stopServer() {
  await new Promise((resolve) => server.close(resolve));
}

async function get(path) {
  const res = await fetch(base + path);
  return { status: res.status, body: await res.json() };
}

async function post(path, body) {
  const res = await fetch(base + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
  return { status: res.status, body: await res.json() };
}

const ltp = (symbol) => getQuote(symbol, FIXED_NOW).price;

describe("read endpoints", () => {
  before(startServer);
  after(stopServer);

  test("health check reports the service and storage", async () => {
    const { status, body } = await get("/");
    assert.equal(status, 200);
    assert.deepEqual(body, { ok: true, service: "vittora-api", storage: "memory" });
  });

  test("seeded holdings come back with live prices and P&L", async () => {
    const { status, body } = await get("/allHoldings");
    assert.equal(status, 200);
    assert.equal(body.length, 13);
    const infy = body.find((h) => h.name === "INFY");
    assert.equal(infy.qty, 1);
    assert.equal(infy.avg, 1350.5);
    assert.equal(infy.price, ltp("INFY"));
    assert.equal(infy.pnl, Math.round((ltp("INFY") - 1350.5) * 100) / 100);
    assert.match(infy.net, /^[+-]\d+\.\d{2}%$/);
    assert.match(infy.day, /^[+-]\d+\.\d{2}%$/);
  });

  test("seeded positions are intraday (MIS)", async () => {
    const { body } = await get("/allPositions");
    assert.equal(body.length, 2);
    assert.ok(body.every((p) => p.product === "MIS"));
  });

  test("quotes include every instrument and both indices", async () => {
    const { body } = await get("/quotes");
    assert.equal(body.indices.length, 2);
    assert.ok(body.instruments.length >= 15);
    for (const q of body.instruments) {
      assert.ok(q.price > 0);
      assert.ok(Math.abs(q.changePercent) < 6, `${q.symbol} moved too far`);
    }
  });

  test("funds start at the opening balance", async () => {
    const { body } = await get("/funds");
    assert.equal(body.openingBalance, OPENING_BALANCE);
    assert.equal(body.available, OPENING_BALANCE);
    assert.ok(body.invested > 0);
  });

  test("orders start empty", async () => {
    const { body } = await get("/allOrders");
    assert.deepEqual(body, []);
  });

  test("unknown routes return a JSON 404", async () => {
    const { status, body } = await get("/nope");
    assert.equal(status, 404);
    assert.match(body.error, /No route/);
  });
});

describe("placing orders", () => {
  before(startServer);
  after(stopServer);

  test("buying an existing holding updates quantity, average and cash", async () => {
    const price = ltp("TCS");
    const { status, body } = await post("/newOrder", { name: "TCS", qty: 2, price, mode: "BUY" });
    assert.equal(status, 201);
    assert.match(body.message, /^Bought 2 TCS at ₹/);
    assert.equal(body.order.status, "COMPLETE");

    const holdings = (await get("/allHoldings")).body;
    const tcs = holdings.find((h) => h.name === "TCS");
    assert.equal(tcs.qty, 3);
    assert.equal(tcs.avg, Math.round(((3041.7 + 2 * price) / 3) * 100) / 100);

    const funds = (await get("/funds")).body;
    assert.equal(funds.available, Math.round((OPENING_BALANCE - 2 * price) * 100) / 100);
  });

  test("buying a new stock adds a holding", async () => {
    const price = ltp("ONGC");
    await post("/newOrder", { name: "ongc", qty: 10, price, mode: "buy" });
    const ongc = (await get("/allHoldings")).body.find((h) => h.name === "ONGC");
    assert.equal(ongc.qty, 10);
    assert.equal(ongc.avg, price);
  });

  test("selling part of a holding keeps the average and returns cash", async () => {
    const before = (await get("/funds")).body.available;
    const price = ltp("ITC");
    const { status } = await post("/newOrder", { name: "ITC", qty: 2, price, mode: "SELL" });
    assert.equal(status, 201);
    const itc = (await get("/allHoldings")).body.find((h) => h.name === "ITC");
    assert.equal(itc.qty, 3);
    assert.equal(itc.avg, 202);
    const after = (await get("/funds")).body.available;
    assert.equal(after, Math.round((before + 2 * price) * 100) / 100);
  });

  test("selling the whole holding removes it", async () => {
    await post("/newOrder", { name: "WIPRO", qty: 4, price: ltp("WIPRO"), mode: "SELL" });
    const names = (await get("/allHoldings")).body.map((h) => h.name);
    assert.ok(!names.includes("WIPRO"));
  });

  test("intraday (MIS) orders go to positions, not holdings", async () => {
    const price = ltp("SBIN");
    await post("/newOrder", { name: "SBIN", qty: 3, price, mode: "BUY", product: "MIS" });
    const positions = (await get("/allPositions")).body;
    const sbin = positions.find((p) => p.name === "SBIN");
    assert.equal(sbin.qty, 3);
    assert.equal(sbin.product, "MIS");
    const holdingSbin = (await get("/allHoldings")).body.find((h) => h.name === "SBIN");
    assert.equal(holdingSbin.qty, 4);

    const funds = (await get("/funds")).body;
    assert.ok(funds.usedMargin >= 3 * price);
  });

  test("intraday orders are charged brokerage, delivery orders are not", async () => {
    const before = (await get("/funds")).body.available;
    const price = ltp("RELIANCE");
    const res = await post("/newOrder", { name: "RELIANCE", qty: 10, price, mode: "BUY", product: "MIS" });
    const value = 10 * price;
    const expected = Math.round(Math.min(20, value * 0.0003) * 100) / 100;
    assert.equal(res.body.order.brokerage, expected);
    assert.equal(res.body.funds.available, Math.round((before - value - expected) * 100) / 100);

    const sell = await post("/newOrder", { name: "RELIANCE", qty: 10, price, mode: "SELL", product: "MIS" });
    assert.equal(sell.body.funds.available, Math.round((before - 2 * expected) * 100) / 100);
    const orders = (await get("/allOrders")).body;
    assert.equal(orders.find((o) => o.product === "CNC").brokerage, 0);
  });

  test("orders are listed newest first", async () => {
    const orders = (await get("/allOrders")).body;
    assert.equal(orders.length, 7);
    assert.equal(orders[0].name, "RELIANCE");
    assert.equal(orders[orders.length - 1].name, "TCS");
    assert.ok(orders[0].createdAt);
  });
});

describe("order validation", () => {
  before(startServer);
  after(stopServer);

  const cases = [
    ["missing stock", { qty: 1, price: 100, mode: "BUY" }, /Choose a stock/],
    [
      "unknown stock",
      { name: "ZZZZ", qty: 1, price: 100, mode: "BUY" },
      /isn't in the Vittora instrument list/,
    ],
    ["bad mode", { name: "INFY", qty: 1, price: 1500, mode: "HOLD" }, /BUY or SELL/],
    ["bad product", { name: "INFY", qty: 1, price: 1500, mode: "BUY", product: "NRML" }, /CNC .* or MIS/],
    ["zero quantity", { name: "INFY", qty: 0, price: 1500, mode: "BUY" }, /whole number of at least 1/],
    ["fractional quantity", { name: "INFY", qty: 1.5, price: 1500, mode: "BUY" }, /whole number/],
    ["huge quantity", { name: "INFY", qty: 20000, price: 1500, mode: "BUY" }, /can't be more than 10,000/],
    ["negative price", { name: "INFY", qty: 1, price: -5, mode: "BUY" }, /more than ₹0/],
    ["text price", { name: "INFY", qty: 1, price: "abc", mode: "BUY" }, /more than ₹0/],
  ];

  for (const [label, body, pattern] of cases) {
    test(`rejects ${label}`, async () => {
      const res = await post("/newOrder", body);
      assert.equal(res.status, 400);
      assert.match(res.body.error, pattern);
    });
  }

  test("rejects a price far from the market price", async () => {
    const res = await post("/newOrder", { name: "INFY", qty: 1, price: ltp("INFY") * 1.5, mode: "BUY" });
    assert.equal(res.status, 400);
    assert.match(res.body.error, /within 10% of the last price/);
    assert.equal(res.body.field, "price");
  });

  test("rejects a buy larger than available cash", async () => {
    const res = await post("/newOrder", { name: "SGBMAY29", qty: 100, price: ltp("SGBMAY29"), mode: "BUY" });
    assert.equal(res.status, 400);
    assert.match(res.body.error, /^Not enough funds/);
  });

  test("rejects selling more than you hold", async () => {
    const res = await post("/newOrder", { name: "INFY", qty: 5, price: ltp("INFY"), mode: "SELL" });
    assert.equal(res.status, 400);
    assert.match(res.body.error, /at most 1 INFY/);
  });

  test("rejects selling a stock you don't own", async () => {
    const res = await post("/newOrder", { name: "QUICKHEAL", qty: 1, price: ltp("QUICKHEAL"), mode: "SELL" });
    assert.equal(res.status, 400);
    assert.match(res.body.error, /don't have any QUICKHEAL/);
  });

  test("rejected orders are not recorded and don't move cash", async () => {
    assert.deepEqual((await get("/allOrders")).body, []);
    assert.equal((await get("/funds")).body.available, OPENING_BALANCE);
  });

  test("rejects malformed JSON", async () => {
    const res = await post("/newOrder", "{not json");
    assert.equal(res.status, 400);
    assert.match(res.body.error, /valid JSON/);
  });
});

describe("funds", () => {
  before(startServer);
  after(stopServer);

  test("adding funds increases available cash and pay-in", async () => {
    const { status, body } = await post("/funds/add", { amount: 5000 });
    assert.equal(status, 200);
    assert.equal(body.message, "Added ₹5,000.00 to your account.");
    assert.equal(body.funds.available, OPENING_BALANCE + 5000);
    assert.equal(body.funds.payin, 5000);
  });

  test("withdrawing reduces cash and records pay-out", async () => {
    const { body } = await post("/funds/withdraw", { amount: 2500.5 });
    assert.equal(body.funds.available, OPENING_BALANCE + 2499.5);
    assert.equal(body.funds.payout, 2500.5);
  });

  test("can't withdraw more than available", async () => {
    const res = await post("/funds/withdraw", { amount: 999999 });
    assert.equal(res.status, 400);
    assert.match(res.body.error, /withdraw at most/);
  });

  test("rejects invalid amounts", async () => {
    for (const amount of [0, -10, "x", 2000000]) {
      const res = await post("/funds/add", { amount });
      assert.equal(res.status, 400, `amount ${amount}`);
    }
  });
});

describe("brokerage rule", () => {
  const { brokerageFor } = require("../services/trading");

  test("delivery is free", () => {
    assert.equal(brokerageFor("CNC", 500000), 0);
  });

  test("intraday is 0.03% on small orders", () => {
    assert.equal(brokerageFor("MIS", 10000), 3);
  });

  test("intraday is capped at ₹20", () => {
    assert.equal(brokerageFor("MIS", 1000000), 20);
  });
});

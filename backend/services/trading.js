// Business rules for the demo trading account: holdings, positions,
// orders and funds. Works with either store (memory or MongoDB).

const { getInstrument, getQuote, getAllQuotes, getIndices } = require("../data/market");
const { SEED_HOLDINGS, SEED_POSITIONS, SEED_ACCOUNT } = require("../data/seed");

const MAX_QTY = 10000;
const PRICE_BAND = 0.1; // orders must be within 10% of the last price
const MAX_FUND_MOVE = 1000000;
const INTRADAY_FLAT = 20; // ₹20 or 0.03% per executed intraday order, whichever is lower
const INTRADAY_RATE = 0.0003;

class HttpError extends Error {
  constructor(status, message, field) {
    super(message);
    this.status = status;
    this.field = field;
  }
}

const inr = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const rupees = (n) => `₹${inr.format(n)}`;
const round2 = (n) => Math.round(n * 100) / 100;
const pct = (n) => `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;

// Brokerage: delivery (CNC) is free; intraday (MIS) is ₹20 or 0.03%, whichever is lower.
function brokerageFor(product, value) {
  if (product !== "MIS") return 0;
  return round2(Math.min(INTRADAY_FLAT, value * INTRADAY_RATE));
}

function parsePct(value) {
  const n = parseFloat(String(value || "").replace("%", ""));
  return Number.isFinite(n) ? n : 0;
}

function enrich(row, now) {
  const quote = getQuote(row.name, now);
  const qty = Number(row.qty) || 0;
  const avg = Number(row.avg) || 0;
  const price = quote ? quote.price : Number(row.price) || avg;
  const dayPct = quote ? quote.changePercent : parsePct(row.day);
  const netPct = avg > 0 ? ((price - avg) / avg) * 100 : 0;
  const invested = avg * qty;
  const curValue = price * qty;
  const out = {
    _id: row._id,
    name: row.name,
    qty,
    avg: round2(avg),
    price: round2(price),
    curValue: round2(curValue),
    invested: round2(invested),
    pnl: round2(curValue - invested),
    net: pct(netPct),
    day: pct(dayPct),
    isLoss: dayPct < 0,
  };
  if (row.product) out.product = row.product;
  return out;
}

function createTrading(store, { clock = () => Date.now() } = {}) {
  async function seedIfEmpty() {
    if ((await store.count("holdings")) === 0) await store.insertMany("holdings", SEED_HOLDINGS);
    if ((await store.count("positions")) === 0) await store.insertMany("positions", SEED_POSITIONS);
    if (!(await store.findOne("account", { key: "primary" }))) {
      await store.upsert("account", { key: "primary" }, { ...SEED_ACCOUNT });
    }
  }

  async function getAccount() {
    let account = await store.findOne("account", { key: "primary" });
    if (!account) account = await store.upsert("account", { key: "primary" }, { ...SEED_ACCOUNT });
    return account;
  }

  async function getHoldings() {
    const now = clock();
    const rows = await store.list("holdings");
    return rows.filter((r) => r.qty > 0).map((r) => enrich(r, now));
  }

  async function getPositions() {
    const now = clock();
    const rows = await store.list("positions");
    return rows.filter((r) => r.qty > 0).map((r) => enrich(r, now));
  }

  async function getOrders(limit = 200) {
    const rows = await store.list("orders", { newestFirst: true, limit });
    return rows.map((o) => ({
      _id: o._id,
      name: o.name,
      qty: o.qty,
      price: o.price,
      mode: o.mode,
      product: o.product || "CNC",
      status: o.status || "COMPLETE",
      brokerage: Number(o.brokerage) || 0,
      createdAt: o.createdAt || null,
    }));
  }

  async function getFunds() {
    const [account, holdings, positions] = await Promise.all([getAccount(), getHoldings(), getPositions()]);
    const sum = (rows, key) => round2(rows.reduce((t, r) => t + r[key], 0));
    return {
      openingBalance: round2(account.openingBalance),
      available: round2(account.cash),
      usedMargin: sum(positions, "invested"),
      payin: round2(account.payin || 0),
      payout: round2(account.payout || 0),
      invested: sum(holdings, "invested"),
      holdingsValue: sum(holdings, "curValue"),
    };
  }

  function getQuotes() {
    const now = clock();
    return { asOf: new Date(now).toISOString(), indices: getIndices(now), instruments: getAllQuotes(now) };
  }

  function readOrder(body = {}) {
    const name = String(body.name || "")
      .trim()
      .toUpperCase();
    if (!name) throw new HttpError(400, "Choose a stock to trade.", "name");
    if (!getInstrument(name)) {
      throw new HttpError(400, `${name} isn't in the Vittora instrument list.`, "name");
    }

    const mode = String(body.mode || "")
      .trim()
      .toUpperCase();
    if (mode !== "BUY" && mode !== "SELL") {
      throw new HttpError(400, "Order type must be BUY or SELL.", "mode");
    }

    const product = String(body.product || "CNC")
      .trim()
      .toUpperCase();
    if (product !== "CNC" && product !== "MIS") {
      throw new HttpError(400, "Product must be CNC (delivery) or MIS (intraday).", "product");
    }

    const qty = Number(body.qty);
    if (!Number.isInteger(qty) || qty < 1) {
      throw new HttpError(400, "Quantity must be a whole number of at least 1.", "qty");
    }
    if (qty > MAX_QTY) {
      throw new HttpError(
        400,
        `Quantity can't be more than ${MAX_QTY.toLocaleString("en-IN")} per order.`,
        "qty",
      );
    }

    const price = round2(Number(body.price));
    if (!Number.isFinite(price) || price <= 0) {
      throw new HttpError(400, "Price must be more than ₹0.", "price");
    }

    const quote = getQuote(name, clock());
    const low = round2(quote.price * (1 - PRICE_BAND));
    const high = round2(quote.price * (1 + PRICE_BAND));
    if (price < low || price > high) {
      throw new HttpError(
        400,
        `Price must be within 10% of the last price, between ${rupees(low)} and ${rupees(high)}.`,
        "price",
      );
    }

    return { name, mode, product, qty, price, quote };
  }

  async function placeOrder(body) {
    const { name, mode, product, qty, price, quote } = readOrder(body);
    const kind = product === "MIS" ? "positions" : "holdings";
    const key = { name };
    const value = round2(qty * price);
    const account = await getAccount();
    const existing = await store.findOne(kind, key);
    const heldQty = existing ? Number(existing.qty) || 0 : 0;

    const brokerage = brokerageFor(product, value);

    if (mode === "BUY") {
      const needed = round2(value + brokerage);
      if (needed > account.cash) {
        throw new HttpError(
          400,
          `Not enough funds. This order needs ${rupees(needed)} and you have ${rupees(account.cash)} available.`,
          "funds",
        );
      }
      const newQty = heldQty + qty;
      const newAvg = (heldQty * (Number(existing?.avg) || 0) + value) / newQty;
      const fields = { qty: newQty, avg: round2(newAvg), price: quote.price };
      if (kind === "positions") fields.product = "MIS";
      await store.upsert(kind, key, fields);
      account.cash = round2(account.cash - needed);
    } else {
      if (heldQty < qty) {
        const where = product === "MIS" ? "in intraday positions" : "in your holdings";
        throw new HttpError(
          400,
          heldQty === 0
            ? `You don't have any ${name} ${where} to sell.`
            : `You can sell at most ${heldQty} ${name} ${where}.`,
          "qty",
        );
      }
      const remaining = heldQty - qty;
      if (remaining === 0) await store.remove(kind, key);
      else await store.upsert(kind, key, { qty: remaining, price: quote.price });
      account.cash = round2(account.cash + value - brokerage);
    }

    await store.upsert("account", { key: "primary" }, { cash: account.cash });
    const order = await store.insert("orders", {
      name,
      qty,
      price,
      mode,
      product,
      brokerage,
      status: "COMPLETE",
      createdAt: new Date(clock()),
    });

    const verb = mode === "BUY" ? "Bought" : "Sold";
    return {
      message: `${verb} ${qty} ${name} at ${rupees(price)}.`,
      order: { ...order, _id: String(order._id) },
      funds: await getFunds(),
    };
  }

  function readAmount(body = {}) {
    const amount = round2(Number(body.amount));
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new HttpError(400, "Enter an amount more than ₹0.", "amount");
    }
    if (amount > MAX_FUND_MOVE) {
      throw new HttpError(400, `You can move at most ${rupees(MAX_FUND_MOVE)} at a time.`, "amount");
    }
    return amount;
  }

  async function addFunds(body) {
    const amount = readAmount(body);
    const account = await getAccount();
    await store.upsert(
      "account",
      { key: "primary" },
      {
        cash: round2(account.cash + amount),
        payin: round2((account.payin || 0) + amount),
      },
    );
    return { message: `Added ${rupees(amount)} to your account.`, funds: await getFunds() };
  }

  async function withdrawFunds(body) {
    const amount = readAmount(body);
    const account = await getAccount();
    if (amount > account.cash) {
      throw new HttpError(400, `You can withdraw at most ${rupees(account.cash)}.`, "amount");
    }
    await store.upsert(
      "account",
      { key: "primary" },
      {
        cash: round2(account.cash - amount),
        payout: round2((account.payout || 0) + amount),
      },
    );
    return { message: `Withdrew ${rupees(amount)} from your account.`, funds: await getFunds() };
  }

  return {
    seedIfEmpty,
    getHoldings,
    getPositions,
    getOrders,
    getFunds,
    getQuotes,
    placeOrder,
    brokerageFor,
    addFunds,
    withdrawFunds,
  };
}

module.exports = { createTrading, brokerageFor, HttpError };

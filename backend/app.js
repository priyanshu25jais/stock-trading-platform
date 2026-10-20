const express = require("express");
const cors = require("cors");

const { createTrading, HttpError } = require("./services/trading");

// Wrap async route handlers so rejected promises reach the error handler.
const handle = (fn) => (req, res, next) => Promise.resolve(fn(req, res)).catch(next);

function createApp(store, options = {}) {
  const trading = createTrading(store, options);
  const app = express();

  const origins = (process.env.CORS_ORIGIN || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
  app.use(cors(origins.length ? { origin: origins } : undefined));
  app.use(express.json({ limit: "20kb" }));

  const health = (req, res) => res.json({ ok: true, service: "vittora-api", storage: store.kind });
  app.get("/", health);
  app.get("/health", health);

  app.get("/quotes", (req, res) => res.json(trading.getQuotes()));
  app.get(
    "/allHoldings",
    handle(async (req, res) => res.json(await trading.getHoldings())),
  );
  app.get(
    "/allPositions",
    handle(async (req, res) => res.json(await trading.getPositions())),
  );
  app.get(
    "/allOrders",
    handle(async (req, res) => res.json(await trading.getOrders())),
  );
  app.get(
    "/funds",
    handle(async (req, res) => res.json(await trading.getFunds())),
  );

  app.post(
    "/newOrder",
    handle(async (req, res) => res.status(201).json(await trading.placeOrder(req.body))),
  );
  app.post(
    "/funds/add",
    handle(async (req, res) => res.json(await trading.addFunds(req.body))),
  );
  app.post(
    "/funds/withdraw",
    handle(async (req, res) => res.json(await trading.withdrawFunds(req.body))),
  );

  app.use((req, res) => {
    res.status(404).json({ error: `No route for ${req.method} ${req.path}.` });
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err instanceof HttpError) {
      return res.status(err.status).json({ error: err.message, field: err.field });
    }
    if (err.type === "entity.parse.failed") {
      return res.status(400).json({ error: "Request body must be valid JSON." });
    }
    console.error(err);
    return res.status(500).json({ error: "Something went wrong on the server. Try again in a moment." });
  });

  app.locals.trading = trading;
  return app;
}

module.exports = { createApp };

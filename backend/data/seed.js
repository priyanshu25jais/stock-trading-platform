// Starting data for a fresh database (or the in-memory store).

const OPENING_BALANCE = 100000;

const SEED_HOLDINGS = [
  { name: "BHARTIARTL", qty: 2, avg: 538.05 },
  { name: "HDFCBANK", qty: 2, avg: 1383.4 },
  { name: "HINDUNILVR", qty: 1, avg: 2335.85 },
  { name: "INFY", qty: 1, avg: 1350.5 },
  { name: "ITC", qty: 5, avg: 202.0 },
  { name: "KPITTECH", qty: 5, avg: 250.3 },
  { name: "M&M", qty: 2, avg: 809.9 },
  { name: "RELIANCE", qty: 1, avg: 2193.7 },
  { name: "SBIN", qty: 4, avg: 324.35 },
  { name: "SGBMAY29", qty: 2, avg: 4727.0 },
  { name: "TATAPOWER", qty: 5, avg: 104.2 },
  { name: "TCS", qty: 1, avg: 3041.7 },
  { name: "WIPRO", qty: 4, avg: 489.3 },
];

const SEED_POSITIONS = [
  { product: "MIS", name: "EVEREADY", qty: 2, avg: 316.27 },
  { product: "MIS", name: "JUBLFOOD", qty: 1, avg: 3124.75 },
];

const SEED_ACCOUNT = {
  key: "primary",
  openingBalance: OPENING_BALANCE,
  cash: OPENING_BALANCE,
  payin: 0,
  payout: 0,
};

module.exports = { OPENING_BALANCE, SEED_HOLDINGS, SEED_POSITIONS, SEED_ACCOUNT };

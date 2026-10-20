// Sample instrument universe and a deterministic price simulator.
//
// Prices are sample data, not live market data. Each instrument moves
// smoothly around its previous close as a pure function of time, so every
// request (holdings, positions, quotes, order checks) sees the same price
// at the same moment without the server having to store ticks.

const INSTRUMENTS = [
  { symbol: "INFY", name: "Infosys", exchange: "NSE", prevClose: 1580.75, dayBias: -0.016 },
  { symbol: "TCS", name: "Tata Consultancy Services", exchange: "NSE", prevClose: 3202.8, dayBias: -0.0025 },
  { symbol: "RELIANCE", name: "Reliance Industries", exchange: "NSE", prevClose: 2082.45, dayBias: 0.0144 },
  { symbol: "HDFCBANK", name: "HDFC Bank", exchange: "NSE", prevClose: 1520.7, dayBias: 0.0011 },
  { symbol: "WIPRO", name: "Wipro", exchange: "NSE", prevClose: 575.9, dayBias: 0.0032 },
  { symbol: "ONGC", name: "Oil & Natural Gas Corp", exchange: "NSE", prevClose: 116.9, dayBias: -0.0009 },
  { symbol: "KPITTECH", name: "KPIT Technologies", exchange: "NSE", prevClose: 257.35, dayBias: 0.0354 },
  {
    symbol: "QUICKHEAL",
    name: "Quick Heal Technologies",
    exchange: "NSE",
    prevClose: 309.0,
    dayBias: -0.0015,
  },
  { symbol: "M&M", name: "Mahindra & Mahindra", exchange: "NSE", prevClose: 779.9, dayBias: -0.0001 },
  { symbol: "BHARTIARTL", name: "Bharti Airtel", exchange: "NSE", prevClose: 525.45, dayBias: 0.0299 },
  { symbol: "HINDUNILVR", name: "Hindustan Unilever", exchange: "NSE", prevClose: 2412.35, dayBias: 0.0021 },
  { symbol: "ITC", name: "ITC", exchange: "NSE", prevClose: 206.25, dayBias: 0.008 },
  { symbol: "SBIN", name: "State Bank of India", exchange: "NSE", prevClose: 431.65, dayBias: -0.0034 },
  { symbol: "TATAPOWER", name: "Tata Power", exchange: "NSE", prevClose: 124.45, dayBias: -0.0024 },
  {
    symbol: "SGBMAY29",
    name: "Sovereign Gold Bond May 2029",
    exchange: "BSE",
    prevClose: 4711.95,
    dayBias: 0.0015,
  },
  { symbol: "EVEREADY", name: "Eveready Industries", exchange: "NSE", prevClose: 316.25, dayBias: -0.0124 },
  { symbol: "JUBLFOOD", name: "Jubilant FoodWorks", exchange: "NSE", prevClose: 3124.8, dayBias: -0.0135 },
];

const INDICES = [
  { symbol: "NIFTY 50", prevClose: 22147.0, dayBias: 0.0042 },
  { symbol: "SENSEX", prevClose: 72831.94, dayBias: 0.0038 },
];

const BY_SYMBOL = new Map(INSTRUMENTS.map((i) => [i.symbol, i]));

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

function roundTick(value, tick = 0.05) {
  return Math.round(value / tick) * tick;
}

function simulate(symbol, prevClose, dayBias, now) {
  const t = now / 1000;
  const p1 = hash(symbol) * Math.PI * 2;
  const p2 = hash(symbol + "#") * Math.PI * 2;
  const wave =
    0.003 * Math.sin((2 * Math.PI * t) / 420 + p1) + 0.0015 * Math.sin((2 * Math.PI * t) / 53 + p2);
  return prevClose * (1 + dayBias + wave);
}

function quoteFor(instrument, now = Date.now(), tick = 0.05) {
  const raw = simulate(instrument.symbol, instrument.prevClose, instrument.dayBias, now);
  const price = Number(roundTick(raw, tick).toFixed(2));
  const change = price - instrument.prevClose;
  return {
    symbol: instrument.symbol,
    name: instrument.name,
    exchange: instrument.exchange,
    price,
    prevClose: instrument.prevClose,
    change: Number(change.toFixed(2)),
    changePercent: Number(((change / instrument.prevClose) * 100).toFixed(2)),
  };
}

function getInstrument(symbol) {
  return BY_SYMBOL.get(String(symbol || "").toUpperCase()) || null;
}

function getQuote(symbol, now = Date.now()) {
  const instrument = getInstrument(symbol);
  return instrument ? quoteFor(instrument, now) : null;
}

function getAllQuotes(now = Date.now()) {
  return INSTRUMENTS.map((i) => quoteFor(i, now));
}

function getIndices(now = Date.now()) {
  return INDICES.map((i) => {
    const q = quoteFor({ ...i, name: i.symbol, exchange: "INDEX" }, now, 0.01);
    return { symbol: q.symbol, price: q.price, change: q.change, changePercent: q.changePercent };
  });
}

module.exports = { INSTRUMENTS, getInstrument, getQuote, getAllQuotes, getIndices };

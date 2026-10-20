import axios from "axios";

const raw = process.env.REACT_APP_API_URL || "https://stock-trading-platform-wezz.onrender.com";
export const API_BASE = raw.replace(/\/$/, "");

export const SITE_URL = (
  process.env.REACT_APP_SITE_URL || "https://stock-tradingplatform.netlify.app"
).replace(/\/$/, "");

const client = axios.create({ baseURL: API_BASE, timeout: 70000 });

// Turn any failed request into a sentence the interface can show.
export function errorMessage(err) {
  if (err?.response?.data?.error) return err.response.data.error;
  if (err?.code === "ECONNABORTED") return "The server took too long to answer. Try again.";
  if (err?.request && !err?.response)
    return "Couldn't reach the Vittora server. Check your connection and try again.";
  return "Something went wrong. Try again.";
}

const data = (promise) => promise.then((res) => res.data);

export const api = {
  health: () => data(client.get("/")),
  quotes: () => data(client.get("/quotes")),
  holdings: () => data(client.get("/allHoldings")),
  positions: () => data(client.get("/allPositions")),
  orders: () => data(client.get("/allOrders")),
  funds: () => data(client.get("/funds")),
  placeOrder: (order) => data(client.post("/newOrder", order)),
  addFunds: (amount) => data(client.post("/funds/add", { amount })),
  withdrawFunds: (amount) => data(client.post("/funds/withdraw", { amount })),
};

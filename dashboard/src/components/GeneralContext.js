import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import { api, errorMessage } from "../api";

// Shared state for the whole dashboard: market quotes, the account's
// holdings/positions/orders/funds, the order window and toast messages.
const GeneralContext = createContext(null);

const NAME_KEY = "vittora.name";
const QUOTE_INTERVAL = 5000;
const SLOW_AFTER = 6000;

function readStoredName() {
  try {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = (params.get("name") || "").trim().slice(0, 40);
    if (fromUrl) {
      window.localStorage.setItem(NAME_KEY, fromUrl);
      params.delete("name");
      const rest = params.toString();
      window.history.replaceState(null, "", window.location.pathname + (rest ? `?${rest}` : ""));
      return fromUrl;
    }
    return window.localStorage.getItem(NAME_KEY) || "";
  } catch (e) {
    return "";
  }
}

function parsePct(value) {
  const n = parseFloat(String(value || "").replace("%", ""));
  return Number.isFinite(n) ? n : 0;
}

// Re-price a holding or position with the latest quote so P&L moves live.
function withQuote(row, quote) {
  const qty = Number(row.qty) || 0;
  const avg = Number(row.avg) || 0;
  const price = quote ? quote.price : Number(row.price) || avg;
  const invested = avg * qty;
  const curValue = price * qty;
  return {
    ...row,
    qty,
    avg,
    price,
    invested,
    curValue,
    pnl: curValue - invested,
    netPct: avg > 0 ? ((price - avg) / avg) * 100 : 0,
    dayPct: quote ? quote.changePercent : parsePct(row.day),
    dayPnl: quote ? quote.change * qty : 0,
  };
}

export function totals(rows) {
  const invested = rows.reduce((t, r) => t + r.invested, 0);
  const current = rows.reduce((t, r) => t + r.curValue, 0);
  const pnl = current - invested;
  const dayPnl = rows.reduce((t, r) => t + r.dayPnl, 0);
  return { invested, current, pnl, pnlPct: invested > 0 ? (pnl / invested) * 100 : 0, dayPnl };
}

export function GeneralContextProvider({ children }) {
  const [status, setStatus] = useState("loading");
  const [loadError, setLoadError] = useState("");
  const [slow, setSlow] = useState(false);
  const [quotes, setQuotes] = useState({ instruments: [], indices: [], asOf: null });
  const [rawHoldings, setRawHoldings] = useState([]);
  const [rawPositions, setRawPositions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [funds, setFunds] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [toast, setToast] = useState(null);
  const [name, setNameState] = useState(readStoredName);
  const toastTimer = useRef(null);

  const showToast = useCallback((message, kind = "success") => {
    window.clearTimeout(toastTimer.current);
    setToast({ message, kind, id: Date.now() });
    toastTimer.current = window.setTimeout(() => setToast(null), 4500);
  }, []);

  const refreshAccount = useCallback(async () => {
    const [h, p, o, f] = await Promise.all([api.holdings(), api.positions(), api.orders(), api.funds()]);
    setRawHoldings(h);
    setRawPositions(p);
    setOrders(o);
    setFunds(f);
  }, []);

  const load = useCallback(async () => {
    setStatus("loading");
    setLoadError("");
    setSlow(false);
    const slowTimer = window.setTimeout(() => setSlow(true), SLOW_AFTER);
    try {
      const [q] = await Promise.all([api.quotes(), refreshAccount()]);
      setQuotes(q);
      setStatus("ready");
    } catch (err) {
      setLoadError(errorMessage(err));
      setStatus("error");
    } finally {
      window.clearTimeout(slowTimer);
    }
  }, [refreshAccount]);

  useEffect(() => {
    load();
  }, [load]);

  // Poll simulated prices while the tab is visible.
  useEffect(() => {
    if (status !== "ready") return undefined;
    const tick = () => {
      if (document.visibilityState !== "visible") return;
      api
        .quotes()
        .then(setQuotes)
        .catch(() => {});
    };
    const id = window.setInterval(tick, QUOTE_INTERVAL);
    return () => window.clearInterval(id);
  }, [status]);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const quoteMap = useMemo(
    () => Object.fromEntries(quotes.instruments.map((q) => [q.symbol, q])),
    [quotes.instruments],
  );

  const holdings = useMemo(
    () => rawHoldings.map((h) => withQuote(h, quoteMap[h.name])),
    [rawHoldings, quoteMap],
  );
  const positions = useMemo(
    () => rawPositions.map((p) => withQuote(p, quoteMap[p.name])),
    [rawPositions, quoteMap],
  );

  const openTicket = useCallback((symbol, mode = "BUY", product = "CNC") => {
    setTicket({ symbol, mode, product, id: Date.now() });
  }, []);
  const closeTicket = useCallback(() => setTicket(null), []);

  const placeOrder = useCallback(
    async (order) => {
      const result = await api.placeOrder(order);
      showToast(result.message);
      setFunds(result.funds);
      refreshAccount().catch(() => {});
      return result;
    },
    [refreshAccount, showToast],
  );

  const moveFunds = useCallback(
    async (direction, amount) => {
      const result = direction === "add" ? await api.addFunds(amount) : await api.withdrawFunds(amount);
      setFunds(result.funds);
      showToast(result.message);
      return result;
    },
    [showToast],
  );

  const setName = useCallback((value) => {
    const clean = String(value || "")
      .trim()
      .slice(0, 40);
    setNameState(clean);
    try {
      if (clean) window.localStorage.setItem(NAME_KEY, clean);
      else window.localStorage.removeItem(NAME_KEY);
    } catch (e) {
      // Storage can be unavailable (private mode); the name still applies for this visit.
    }
  }, []);

  const value = {
    status,
    loadError,
    slow,
    reload: load,
    quotes,
    quoteMap,
    holdings,
    positions,
    orders,
    funds,
    ticket,
    openTicket,
    closeTicket,
    placeOrder,
    moveFunds,
    toast,
    dismissToast: () => setToast(null),
    showToast,
    name,
    setName,
  };

  return <GeneralContext.Provider value={value}>{children}</GeneralContext.Provider>;
}

export function useTrading() {
  const ctx = useContext(GeneralContext);
  if (!ctx) throw new Error("useTrading must be used inside GeneralContextProvider");
  return ctx;
}

export default GeneralContext;

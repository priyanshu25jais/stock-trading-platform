import React, { useMemo, useState } from "react";

import { useTrading } from "./GeneralContext";
import { inr, signedPct, tone } from "../format";

function WatchListItem({ quote }) {
  const { openTicket } = useTrading();
  const t = tone(quote.change);
  return (
    <li className="wl-item">
      <div className="wl-info">
        <span className={`wl-symbol ${t}`}>{quote.symbol}</span>
        <span className="wl-meta">
          {quote.exchange} <span className="wl-company">{quote.name}</span>
        </span>
      </div>
      <div className="wl-price">
        <span className="num wl-ltp">{inr(quote.price)}</span>
        <span className={`num wl-change ${t}`}>
          <span aria-hidden="true">{quote.change >= 0 ? "▲" : "▼"}</span> {signedPct(quote.changePercent)}
        </span>
      </div>
      <div className="wl-actions">
        <button
          type="button"
          className="wl-btn wl-buy"
          onClick={() => openTicket(quote.symbol, "BUY")}
          aria-label={`Buy ${quote.symbol}`}
          title="Buy"
        >
          B
        </button>
        <button
          type="button"
          className="wl-btn wl-sell"
          onClick={() => openTicket(quote.symbol, "SELL")}
          aria-label={`Sell ${quote.symbol}`}
          title="Sell"
        >
          S
        </button>
      </div>
    </li>
  );
}

const WatchList = () => {
  const { quotes } = useTrading();
  const [search, setSearch] = useState("");

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return quotes.instruments;
    return quotes.instruments.filter(
      (i) => i.symbol.toLowerCase().includes(q) || i.name.toLowerCase().includes(q),
    );
  }, [quotes.instruments, search]);

  return (
    <section className="watchlist">
      <div className="wl-head">
        <label htmlFor="wl-search" className="sr-only">
          Search stocks
        </label>
        <input
          id="wl-search"
          type="search"
          className="wl-search"
          placeholder="Search stocks, e.g. infy or bank"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoComplete="off"
        />
        <span className="wl-count num" aria-live="polite">
          {visible.length} / {quotes.instruments.length}
        </span>
      </div>

      {visible.length ? (
        <ul className="wl-list">
          {visible.map((quote) => (
            <WatchListItem quote={quote} key={quote.symbol} />
          ))}
        </ul>
      ) : (
        <p className="wl-empty">
          No stock matches “{search.trim()}”. Try a symbol like TCS or a company name.
        </p>
      )}

      <p className="wl-footnote">Sample prices with simulated movement, refreshed every 5 seconds.</p>
    </section>
  );
};

export default WatchList;

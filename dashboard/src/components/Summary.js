import React from "react";
import { Link } from "react-router-dom";

import AllocationChart from "./AllocationChart";
import { totals, useTrading } from "./GeneralContext";
import { compact, rupees, signedPct, time, tone } from "../format";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const Summary = () => {
  const { name, funds, holdings, orders } = useTrading();
  const t = totals(holdings);
  const recent = orders.slice(0, 5);

  return (
    <div className="page summary">
      <header className="page-head">
        <h1 className="greeting">
          {greeting()}
          {name ? `, ${name}` : ""}
        </h1>
        <p className="page-sub">Here's where your demo portfolio stands right now.</p>
      </header>

      <div className="summary-grid">
        <section className="figure-block" aria-labelledby="equity-h">
          <h2 id="equity-h" className="block-title">
            Equity
          </h2>
          <p className="figure num">{funds ? compact(funds.available) : "—"}</p>
          <p className="figure-label">Cash available to trade</p>
          <dl className="mini-facts">
            <div>
              <dt>Used margin</dt>
              <dd className="num">{funds ? rupees(funds.usedMargin) : "—"}</dd>
            </div>
            <div>
              <dt>Opening balance</dt>
              <dd className="num">{funds ? rupees(funds.openingBalance) : "—"}</dd>
            </div>
          </dl>
          <Link to="/funds" className="text-link">
            Manage funds
          </Link>
        </section>

        <section className="figure-block" aria-labelledby="holdings-h">
          <h2 id="holdings-h" className="block-title">
            Holdings ({holdings.length})
          </h2>
          <p className={`figure num ${tone(t.pnl)}`}>
            {t.pnl >= 0 ? "+" : "−"}
            {compact(Math.abs(t.pnl))} <span className="figure-pct">{signedPct(t.pnlPct)}</span>
          </p>
          <p className="figure-label">Total P&amp;L</p>
          <dl className="mini-facts">
            <div>
              <dt>Current value</dt>
              <dd className="num">{rupees(t.current)}</dd>
            </div>
            <div>
              <dt>Investment</dt>
              <dd className="num">{rupees(t.invested)}</dd>
            </div>
            <div>
              <dt>Today</dt>
              <dd className={`num ${tone(t.dayPnl)}`}>
                {t.dayPnl >= 0 ? "+" : "−"}
                {rupees(Math.abs(t.dayPnl))}
              </dd>
            </div>
          </dl>
          <Link to="/holdings" className="text-link">
            See all holdings
          </Link>
        </section>
      </div>

      <div className="summary-grid summary-grid-wide">
        <section aria-labelledby="alloc-h">
          <h2 id="alloc-h" className="block-title">
            Where your money is
          </h2>
          {holdings.length ? (
            <AllocationChart rows={holdings} />
          ) : (
            <p className="empty-note">
              You don't own any stocks yet. Buy one from the watchlist to see it here.
            </p>
          )}
        </section>

        <section aria-labelledby="recent-h">
          <h2 id="recent-h" className="block-title">
            Recent orders
          </h2>
          {recent.length ? (
            <ul className="recent-orders">
              {recent.map((o) => (
                <li key={o._id}>
                  <span className={`badge badge-${o.mode.toLowerCase()}`}>{o.mode}</span>
                  <span className="recent-name">{o.name}</span>
                  <span className="num recent-qty">
                    {o.qty} at {rupees(o.price)}
                  </span>
                  <span className="recent-time">{time(o.createdAt)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-note">
              No orders yet. Hover over a stock in the watchlist and press B to buy or S to sell.
            </p>
          )}
          {orders.length > 0 && (
            <Link to="/orders" className="text-link">
              See all orders
            </Link>
          )}
        </section>
      </div>
    </div>
  );
};

export default Summary;

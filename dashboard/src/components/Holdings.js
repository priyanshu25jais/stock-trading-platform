import React from "react";

import VerticalGraph from "./VerticalGraph";
import { totals, useTrading } from "./GeneralContext";
import { inr, rupees, signedPct, tone } from "../format";

export function RowActions({ symbol, product = "CNC" }) {
  const { openTicket } = useTrading();
  return (
    <span className="row-actions">
      <button type="button" className="chip chip-buy" onClick={() => openTicket(symbol, "BUY", product)}>
        Buy
      </button>
      <button type="button" className="chip chip-sell" onClick={() => openTicket(symbol, "SELL", product)}>
        Sell
      </button>
    </span>
  );
}

const Holdings = () => {
  const { holdings } = useTrading();
  const t = totals(holdings);

  return (
    <div className="page">
      <header className="page-head page-head-row">
        <h1 className="page-title">Holdings ({holdings.length})</h1>
        <p className="page-sub">Delivery (CNC) shares you own. Prices update live.</p>
      </header>

      {holdings.length === 0 ? (
        <p className="empty-note">
          You don't own any shares yet. Choose a stock in the watchlist and buy it as Delivery (CNC).
        </p>
      ) : (
        <>
          <div className="totals">
            <div>
              <p className="totals-value num">{rupees(t.invested)}</p>
              <p className="totals-label">Total investment</p>
            </div>
            <div>
              <p className="totals-value num">{rupees(t.current)}</p>
              <p className="totals-label">Current value</p>
            </div>
            <div>
              <p className={`totals-value num ${tone(t.pnl)}`}>
                {t.pnl >= 0 ? "+" : "−"}
                {rupees(Math.abs(t.pnl))} <span className="totals-pct">{signedPct(t.pnlPct)}</span>
              </p>
              <p className="totals-label">P&amp;L</p>
            </div>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Instrument</th>
                  <th scope="col">Qty.</th>
                  <th scope="col">Avg. cost</th>
                  <th scope="col">LTP</th>
                  <th scope="col">Cur. value</th>
                  <th scope="col">P&amp;L</th>
                  <th scope="col">Net chg.</th>
                  <th scope="col">Day chg.</th>
                  <th scope="col">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h) => (
                  <tr key={h._id || h.name}>
                    <th scope="row">{h.name}</th>
                    <td className="num">{h.qty}</td>
                    <td className="num">{inr(h.avg)}</td>
                    <td className="num">{inr(h.price)}</td>
                    <td className="num">{inr(h.curValue)}</td>
                    <td className={`num ${tone(h.pnl)}`}>
                      {h.pnl >= 0 ? "+" : "−"}
                      {inr(Math.abs(h.pnl))}
                    </td>
                    <td className={`num ${tone(h.netPct)}`}>{signedPct(h.netPct)}</td>
                    <td className={`num ${tone(h.dayPct)}`}>{signedPct(h.dayPct)}</td>
                    <td>
                      <RowActions symbol={h.name} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <section aria-labelledby="pnl-chart-h" className="chart-section">
            <h2 id="pnl-chart-h" className="block-title">
              P&amp;L by holding
            </h2>
            <p className="chart-note">Bars above the line are gains, bars below are losses.</p>
            <VerticalGraph rows={holdings} />
          </section>
        </>
      )}
    </div>
  );
};

export default Holdings;

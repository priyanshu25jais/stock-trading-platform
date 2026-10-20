import React from "react";

import { RowActions } from "./Holdings";
import { totals, useTrading } from "./GeneralContext";
import { inr, rupees, signedPct, tone } from "../format";

const Positions = () => {
  const { positions } = useTrading();
  const t = totals(positions);

  return (
    <div className="page">
      <header className="page-head page-head-row">
        <h1 className="page-title">Positions ({positions.length})</h1>
        <p className="page-sub">Intraday (MIS) trades that are still open.</p>
      </header>

      {positions.length === 0 ? (
        <p className="empty-note">
          No open intraday positions. To open one, choose Intraday (MIS) in the order window when you buy.
        </p>
      ) : (
        <>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Product</th>
                  <th scope="col">Instrument</th>
                  <th scope="col">Qty.</th>
                  <th scope="col">Avg.</th>
                  <th scope="col">LTP</th>
                  <th scope="col">P&amp;L</th>
                  <th scope="col">Chg.</th>
                  <th scope="col">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {positions.map((p) => (
                  <tr key={p._id || p.name}>
                    <td>
                      <span className="badge badge-product">{p.product || "MIS"}</span>
                    </td>
                    <th scope="row">{p.name}</th>
                    <td className="num">{p.qty}</td>
                    <td className="num">{inr(p.avg)}</td>
                    <td className="num">{inr(p.price)}</td>
                    <td className={`num ${tone(p.pnl)}`}>
                      {p.pnl >= 0 ? "+" : "−"}
                      {inr(Math.abs(p.pnl))}
                    </td>
                    <td className={`num ${tone(p.dayPct)}`}>{signedPct(p.dayPct)}</td>
                    <td>
                      <RowActions symbol={p.name} product="MIS" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="table-total">
            Total P&amp;L{" "}
            <span className={`num ${tone(t.pnl)}`}>
              {t.pnl >= 0 ? "+" : "−"}
              {rupees(Math.abs(t.pnl))}
            </span>
          </p>
        </>
      )}
    </div>
  );
};

export default Positions;

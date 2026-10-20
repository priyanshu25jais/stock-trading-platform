import React from "react";
import { Link } from "react-router-dom";

export const CHARGES = [
  { item: "Delivery (CNC) orders", price: "₹0", note: "Buy and hold with no brokerage." },
  { item: "Intraday (MIS) orders", price: "₹20 or 0.03%", note: "Per executed order, whichever is lower." },
  { item: "Account opening and upkeep", price: "₹0", note: "No sign-up fee and no yearly charge." },
];

function Pricing() {
  return (
    <section className="section">
      <div className="site-container split">
        <div>
          <h2 className="section-title">Flat, simple brokerage</h2>
          <p>
            Vittora charges the same simple rates many Indian discount brokers use, so the numbers you
            practise with look like the ones you'll see later.
          </p>
          <Link to="/pricing" className="text-link">
            See pricing and a brokerage calculator
          </Link>
        </div>
        <table className="ledger-table">
          <caption className="sr-only">Vittora charges</caption>
          <tbody>
            {CHARGES.map((c) => (
              <tr key={c.item}>
                <th scope="row">
                  {c.item}
                  <span>{c.note}</span>
                </th>
                <td>{c.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Pricing;

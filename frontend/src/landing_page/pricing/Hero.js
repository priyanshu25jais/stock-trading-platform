import React from "react";

import { CHARGES } from "../home/Pricing";

function Hero() {
  return (
    <section className="site-container page-hero">
      <h1 className="page-title">Pricing</h1>
      <p className="lede">
        Delivery trades are free. Intraday trades cost ₹20 or 0.03% of the order value, whichever is lower.
        The desk takes brokerage from your demo cash the moment an order goes through.
      </p>

      <table className="ledger-table ledger-table-large">
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
          <tr>
            <th scope="row">
              Adding or withdrawing funds
              <span>Move demo money in or out at any time.</span>
            </th>
            <td>₹0</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

export default Hero;

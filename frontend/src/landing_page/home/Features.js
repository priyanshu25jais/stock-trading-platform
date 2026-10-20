import React from "react";

const FEATURES = [
  {
    title: "Prices that move",
    text: "Seventeen NSE and BSE stocks, plus NIFTY 50 and SENSEX, update every few seconds, so your P&L changes while you watch.",
  },
  {
    title: "Orders checked like a broker would",
    text: "Vittora refuses orders you can't afford, sales of shares you don't own, and prices more than 10% away from the market.",
  },
  {
    title: "Delivery and intraday",
    text: "Buy as Delivery (CNC) to keep shares in your holdings, or as Intraday (MIS) for positions you plan to close the same day.",
  },
  {
    title: "Your numbers, worked out",
    text: "Average cost, current value, day change and total P&L are calculated for every holding, and every order is kept in a log.",
  },
];

function Features() {
  return (
    <section className="section section-tinted">
      <div className="site-container">
        <h2 className="section-title">Why practise on Vittora</h2>
        <div className="feature-grid">
          {FEATURES.map((f) => (
            <div className="feature" key={f.title}>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;

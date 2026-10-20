import React from "react";

const TERMS = [
  ["LTP", "Last traded price: the most recent price a share changed hands at."],
  ["Avg. cost", "What you paid per share on average, across all your buys of that stock."],
  ["CNC", "Cash and carry, or delivery. Shares you buy are kept in your holdings."],
  ["MIS", "Margin intraday square-off. A trade you open and close on the same day."],
  ["P&L", "Profit and loss: current value minus what you invested."],
  ["Day change", "How much a price has moved since the previous day's close."],
];

function Education() {
  return (
    <section className="section section-tinted">
      <div className="site-container split split-top">
        <div>
          <h2 className="section-title">Words you'll see on the desk</h2>
          <p>Trading screens are full of short forms. Here's what the ones on Vittora mean.</p>
        </div>
        <dl className="glossary">
          {TERMS.map(([term, meaning]) => (
            <div key={term}>
              <dt>{term}</dt>
              <dd>{meaning}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default Education;

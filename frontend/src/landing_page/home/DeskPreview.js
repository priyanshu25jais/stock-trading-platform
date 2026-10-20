import React from "react";

import { DASHBOARD_URL } from "../links";

function DeskPreview() {
  return (
    <section className="section">
      <div className="site-container">
        <div className="section-head">
          <h2 className="section-title">Everything a trader looks at, on one screen</h2>
          <p>
            Your watchlist on the left, your portfolio on the right, and an order window that opens wherever
            you press Buy or Sell.
          </p>
        </div>
        <figure className="shot shot-wide">
          <img
            src={`${process.env.PUBLIC_URL}/media/images/desk-holdings.webp`}
            alt="Vittora dashboard showing a watchlist of NSE stocks beside a holdings table with profit and loss for each stock"
            width="1440"
            height="900"
            loading="lazy"
          />
        </figure>
        <a className="text-link" href={DASHBOARD_URL}>
          Open the live dashboard
        </a>
      </div>
    </section>
  );
}

export default DeskPreview;

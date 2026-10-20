import React from "react";

import { DASHBOARD_URL } from "../links";

function Hero() {
  return (
    <section className="site-container page-hero">
      <h1 className="page-title">One desk for watching, trading and tracking</h1>
      <p className="lede">
        Vittora Desk is the trading screen behind every account. Here's what each part of it does.
      </p>
      <div className="hero-actions">
        <a href={DASHBOARD_URL} className="button button-primary">
          Open Vittora Desk
        </a>
      </div>
    </section>
  );
}

export default Hero;

import React from "react";
import { Link } from "react-router-dom";

// One long price line runs along the bottom of the hero, clear of the text,
// then climbs the open right-hand side. Coordinates are percentages of the hero.
const POINTS = [
  [0, 94],
  [6, 91],
  [11, 94],
  [17, 89],
  [23, 92],
  [29, 87],
  [35, 90],
  [41, 85],
  [47, 88],
  [53, 82],
  [58, 85],
  [63, 76],
  [67, 79],
  [71, 66],
  [75, 70],
  [79, 55],
  [83, 59],
  [87, 43],
  [90, 47],
  [94, 30],
];
const LINE = POINTS.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
const [END_X, END_Y] = POINTS[POINTS.length - 1];

function Hero() {
  return (
    <section className="hero">
      <div className="hero-line" aria-hidden="true">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
          <path d={LINE} vectorEffect="non-scaling-stroke" />
        </svg>
        <span className="hero-line-dot" style={{ left: `${END_X}%`, top: `${END_Y}%` }} />
      </div>

      <div className="site-container hero-inner">
        <h1 className="hero-title">Learn to trade on a desk that behaves like the real one.</h1>
        <p className="lede">
          Vittora is a practice brokerage for Indian stocks. Watch NSE and BSE prices move, place delivery and
          intraday orders, and see your P&amp;L change, with demo money and nothing at risk.
        </p>
        <div className="hero-actions">
          <Link to="/signup" className="button button-primary">
            Start practising free
          </Link>
          <Link to="/product" className="text-link">
            See what's on the desk
          </Link>
        </div>
        <p className="hero-tag">
          <span className="num">₹1,00,000</span> of practice money in every new account
        </p>
      </div>
    </section>
  );
}

export default Hero;

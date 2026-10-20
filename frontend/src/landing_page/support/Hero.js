import React from "react";

function Hero({ query, onQuery }) {
  return (
    <section className="support-hero">
      <div className="site-container">
        <h1 className="page-title">How can we help?</h1>
        <p className="lede">Search the questions people ask most about Vittora.</p>
        <form className="support-search" role="search" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="support-q" className="sr-only">
            Search help
          </label>
          <input
            id="support-q"
            type="search"
            placeholder="Try “brokerage”, “sell” or “funds”"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            autoComplete="off"
          />
        </form>
      </div>
    </section>
  );
}

export default Hero;

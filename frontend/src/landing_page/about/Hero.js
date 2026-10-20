import React from "react";

function Hero() {
  return (
    <section className="site-container page-hero">
      <h1 className="page-title">A practice desk, not a broker</h1>
      <p className="lede">
        Most people place their first real trade without ever having seen an order window. Vittora gives you
        one to learn on, with prices that move and rules that push back, and no money on the line.
      </p>

      <div className="prose-columns">
        <div>
          <h2>Where the name comes from</h2>
          <p>
            <em lang="sa">Vitta</em> (वित्त) is Sanskrit for wealth and finance. Vittora is our word for a
            place to get comfortable with both before it costs anything.
          </p>
        </div>
        <div>
          <h2>What you can do here</h2>
          <p>
            Every account starts with ₹1,00,000 of demo money. You can buy and sell seventeen Indian stocks as
            delivery or intraday trades, add or withdraw demo funds, and follow your P&amp;L as prices change.
          </p>
        </div>
        <div>
          <h2>What Vittora is not</h2>
          <p>
            Vittora isn't registered with SEBI or any exchange. It can't hold real money or shares, and its
            prices are sample data with simulated movement. Use it to learn, not to decide real investments.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Hero;

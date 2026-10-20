import React from "react";
import { Link } from "react-router-dom";

function OpenAccount({ title = "Start with ₹1,00,000 of practice money" }) {
  return (
    <section className="cta-band">
      <div className="site-container cta-inner">
        <div>
          <h2>{title}</h2>
          <p>No KYC, no bank details, no risk. Pick a name and you're trading in under a minute.</p>
        </div>
        <Link to="/signup" className="button button-light">
          Sign up free
        </Link>
      </div>
    </section>
  );
}

export default OpenAccount;

import React, { useState } from "react";

import { DASHBOARD_URL, dashboardLink } from "../links";

function Signup() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    const clean = name.trim();
    if (clean.length < 2) {
      setError("Enter a name with at least 2 characters.");
      return;
    }
    window.location.assign(dashboardLink(clean));
  }

  return (
    <section className="site-container signup">
      <div className="signup-copy">
        <h1 className="page-title">Open your practice account</h1>
        <p className="lede">Trade Indian stocks with demo money. You'll be on the desk in a few seconds.</p>
        <ul className="signup-facts">
          <li>₹1,00,000 of practice cash to start</li>
          <li>Seventeen NSE and BSE stocks to buy and sell</li>
          <li>No email, password, KYC or bank details</li>
        </ul>
      </div>

      <form className="signup-form" onSubmit={submit} noValidate>
        <label htmlFor="signup-name">What should the desk call you?</label>
        <input
          id="signup-name"
          type="text"
          autoComplete="given-name"
          maxLength={40}
          placeholder="Your name"
          value={name}
          aria-invalid={Boolean(error)}
          aria-describedby="signup-help signup-error"
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
        />
        <p id="signup-help" className="field-help">
          Only used to greet you. It's saved in your browser, not on our server.
        </p>
        <p id="signup-error" className="form-error" role="alert">
          {error}
        </p>
        <button type="submit" className="button button-primary button-block">
          Open my dashboard
        </button>
        <p className="signup-skip">
          Or <a href={`${DASHBOARD_URL}/`}>go straight to the dashboard</a> without a name.
        </p>
      </form>
    </section>
  );
}

export default Signup;

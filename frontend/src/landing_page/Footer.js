import React from "react";
import { Link } from "react-router-dom";

import Logo from "./Logo";
import { AUTHOR_URL, DASHBOARD_URL, REPO_URL } from "./links";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo />
            <p>A practice desk for learning how stock trading works in India.</p>
          </div>
          <nav className="footer-links" aria-label="Footer">
            <div>
              <h2>Product</h2>
              <a href={DASHBOARD_URL}>Dashboard</a>
              <Link to="/product">Features</Link>
              <Link to="/pricing">Pricing</Link>
              <Link to="/signup">Sign up</Link>
            </div>
            <div>
              <h2>Company</h2>
              <Link to="/about">About Vittora</Link>
              <a href={REPO_URL}>Source code on GitHub</a>
            </div>
            <div>
              <h2>Help</h2>
              <Link to="/support">Support and FAQ</Link>
              <a href={`${REPO_URL}/issues`}>Report a problem</a>
            </div>
          </nav>
        </div>

        <div className="footer-legal">
          <p>
            Vittora is a student portfolio project, not a stock broker. It is not registered with SEBI or any
            exchange, and it can't hold real money or shares. Prices are sample data with simulated movement,
            and every order placed on Vittora is simulated.
          </p>
          <p>
            Investing in the real securities market carries risk. Before you invest real money, read the
            documents your SEBI-registered broker provides.
          </p>
          <p className="footer-credit">
            © {new Date().getFullYear()} Vittora. Designed and built by{" "}
            <a href={AUTHOR_URL}>Priyanshu Jaiswal</a>.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

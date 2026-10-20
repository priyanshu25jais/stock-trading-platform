import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="site-container page-hero not-found">
      <h1 className="page-title">This page doesn't exist</h1>
      <p className="lede">The link may be old, or the address may have a typo.</p>
      <div className="hero-actions">
        <Link to="/" className="button button-primary">
          Go to the home page
        </Link>
        <Link to="/support" className="text-link">
          Get help
        </Link>
      </div>
    </section>
  );
}

export default NotFound;

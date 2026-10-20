import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import Logo from "./Logo";

const LINKS = [
  { to: "/product", label: "Products" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/support", label: "Support" },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="site-header">
      <div className="site-container header-inner">
        <Link to="/" className="brand-link" aria-label="Vittora home">
          <Logo />
        </Link>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen(!open)}
        >
          <span className="menu-toggle-bars" aria-hidden="true" />
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
        <nav id="site-nav" className={`site-nav${open ? " is-open" : ""}`} aria-label="Main">
          <ul>
            {LINKS.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className="site-nav-link">
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <Link to="/signup" className="button button-primary button-sm">
            Sign up
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;

import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";

import Logo from "./Logo";
import { useTrading } from "./GeneralContext";
import { SITE_URL } from "../api";

const LINKS = [
  { to: "/watchlist", label: "Watchlist", mobileOnly: true },
  { to: "/", label: "Dashboard", end: true },
  { to: "/orders", label: "Orders" },
  { to: "/holdings", label: "Holdings" },
  { to: "/positions", label: "Positions" },
  { to: "/funds", label: "Funds" },
];

function initials(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "V";
  return (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
}

function Profile() {
  const { name, setName } = useTrading();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const save = (e) => {
    e.preventDefault();
    setName(draft);
    setEditing(false);
    setOpen(false);
  };

  return (
    <div className="profile" ref={ref}>
      <button
        type="button"
        className="profile-button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => {
          setOpen(!open);
          setEditing(false);
          setDraft(name);
        }}
      >
        <span className="avatar" aria-hidden="true">
          {initials(name)}
        </span>
        <span className="profile-name">{name || "Guest"}</span>
      </button>
      {open && (
        <div className="profile-menu" role="menu">
          {editing ? (
            <form onSubmit={save} className="profile-form">
              <label htmlFor="display-name">Display name</label>
              <input
                id="display-name"
                value={draft}
                maxLength={40}
                autoFocus
                onChange={(e) => setDraft(e.target.value)}
              />
              <div className="profile-form-actions">
                <button type="submit" className="btn btn-primary btn-sm">
                  Save name
                </button>
                <button type="button" className="btn btn-quiet btn-sm" onClick={() => setEditing(false)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <p className="profile-menu-name">{name || "Guest"}</p>
              <p className="profile-menu-note">Demo account with simulated trades</p>
              <button
                type="button"
                role="menuitem"
                className="profile-menu-item"
                onClick={() => setEditing(true)}
              >
                Change display name
              </button>
              <Link role="menuitem" className="profile-menu-item" to="/apps" onClick={() => setOpen(false)}>
                How Vittora works
              </Link>
              <a role="menuitem" className="profile-menu-item" href={SITE_URL}>
                Go to the Vittora website
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const Menu = () => (
  <div className="menu-bar">
    <NavLink to="/" className="brand-link" aria-label="Vittora Desk home">
      <Logo onDark />
    </NavLink>
    <nav className="nav" aria-label="Dashboard sections">
      <ul>
        {LINKS.map((link) => (
          <li key={link.to} className={link.mobileOnly ? "nav-mobile" : undefined}>
            <NavLink
              to={link.to}
              end={link.end}
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
    <Profile />
  </div>
);

export default Menu;

import React, { useEffect, useState } from "react";

import { API_BASE, SITE_URL, api, errorMessage } from "../api";

const ENDPOINTS = [
  ["GET", "/quotes", "Sample prices for every instrument and index"],
  ["GET", "/allHoldings", "Delivery holdings with live P&L"],
  ["GET", "/allPositions", "Open intraday positions"],
  ["GET", "/allOrders", "All orders, newest first"],
  ["GET", "/funds", "Cash balance and fund movements"],
  ["POST", "/newOrder", "Place a buy or sell order"],
  ["POST", "/funds/add", "Add demo money"],
  ["POST", "/funds/withdraw", "Withdraw demo money"],
];

const Apps = () => {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .health()
      .then(setHealth)
      .catch((err) => setError(errorMessage(err)));
  }, []);

  return (
    <div className="page">
      <header className="page-head page-head-row">
        <h1 className="page-title">How Vittora works</h1>
        <p className="page-sub">The three parts of Vittora and how they connect.</p>
      </header>

      <div className="apps-list">
        <section className="app-row">
          <h2>Vittora website</h2>
          <p>Product, pricing and support pages. Sign up there to open this dashboard with your name.</p>
          <a className="text-link" href={SITE_URL}>
            Open the website
          </a>
        </section>

        <section className="app-row">
          <h2>Vittora Desk</h2>
          <p>This dashboard: watchlist, order window, holdings, positions, orders and funds.</p>
          <p className="muted">You're using it now.</p>
        </section>

        <section className="app-row">
          <h2>Vittora API</h2>
          <p>
            The Node.js and Express server that stores the account and checks every order.{" "}
            <span className="muted">
              Base URL <code>{API_BASE}</code>
            </span>
          </p>
          <p className="api-status" role="status">
            {health ? (
              <>
                <span className="dot dot-ok" aria-hidden="true" /> Connected. Storage:{" "}
                {health.storage === "mongodb" ? "MongoDB" : "in-memory (resets on restart)"}
              </>
            ) : error ? (
              <>
                <span className="dot dot-bad" aria-hidden="true" /> {error}
              </>
            ) : (
              "Checking connection…"
            )}
          </p>
          <div className="table-wrap">
            <table className="data-table endpoint-table">
              <thead>
                <tr>
                  <th scope="col">Method</th>
                  <th scope="col">Path</th>
                  <th scope="col">What it does</th>
                </tr>
              </thead>
              <tbody>
                {ENDPOINTS.map(([method, path, what]) => (
                  <tr key={path}>
                    <td>
                      <span className={`badge badge-${method === "GET" ? "get" : "post"}`}>{method}</span>
                    </td>
                    <th scope="row">
                      <code>{path}</code>
                    </th>
                    <td>{what}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Apps;

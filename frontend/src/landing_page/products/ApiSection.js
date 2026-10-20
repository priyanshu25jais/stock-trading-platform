import React, { useEffect, useState } from "react";

import { API_URL } from "../links";

const ENDPOINTS = [
  ["GET", "/quotes", "Prices for every stock and index"],
  ["GET", "/allHoldings", "Delivery holdings with P&L"],
  ["GET", "/allPositions", "Open intraday positions"],
  ["GET", "/allOrders", "Every order, newest first"],
  ["GET", "/funds", "Cash and fund movements"],
  ["POST", "/newOrder", "Place a buy or sell order"],
  ["POST", "/funds/add", "Add demo money"],
  ["POST", "/funds/withdraw", "Withdraw demo money"],
];

function ApiStatus() {
  const [state, setState] = useState("checking");

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 60000);
    fetch(`${API_URL}/`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((body) => setState(body.storage === "mongodb" ? "online-db" : "online"))
      .catch(() => setState("offline"))
      .finally(() => clearTimeout(timer));
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, []);

  const text = {
    checking: "Checking the API… the free server can take up to a minute to wake up.",
    online: "The API is online.",
    "online-db": "The API is online and connected to MongoDB.",
    offline: "The API didn't answer. It may be waking up; refresh in a minute.",
  }[state];

  return (
    <p className={`api-status api-${state}`} role="status">
      <span className="api-dot" aria-hidden="true" />
      {text}
    </p>
  );
}

function ApiSection() {
  return (
    <section className="section section-tinted">
      <div className="site-container split split-top">
        <div>
          <h2 className="section-title">The Vittora API</h2>
          <p>
            The desk is powered by a small REST API built with Node.js and Express. It stores holdings,
            positions, orders and funds, and checks every order before accepting it.
          </p>
          <ApiStatus />
        </div>
        <table className="ledger-table endpoint-table">
          <caption className="sr-only">API endpoints</caption>
          <tbody>
            {ENDPOINTS.map(([method, path, what]) => (
              <tr key={path}>
                <th scope="row">
                  <code>
                    <span className={`method method-${method.toLowerCase()}`}>{method}</span> {path}
                  </code>
                  <span>{what}</span>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ApiSection;

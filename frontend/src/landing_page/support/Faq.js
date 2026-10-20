import React from "react";

import { REPO_URL } from "../links";

export const FAQ = [
  {
    topic: "Getting started",
    items: [
      {
        q: "Is Vittora a real broker?",
        a: "No. Vittora is a practice platform built as a student project. It isn't registered with SEBI or any exchange, can't hold real money or shares, and every order is simulated.",
      },
      {
        q: "How do I open an account?",
        a: "Go to Sign up, enter the name you'd like the desk to greet you with, and press Open my dashboard. There's no email, password or KYC.",
      },
      {
        q: "How much money do I start with?",
        a: "Every account starts with ₹1,00,000 of demo cash plus a sample portfolio of thirteen holdings and two intraday positions, so there's something to look at straight away.",
      },
      {
        q: "Why does the dashboard take a while to load the first time?",
        a: "The Vittora API runs on a free server that sleeps when nobody is using it. The first request wakes it up, which can take up to a minute. After that it responds quickly.",
      },
    ],
  },
  {
    topic: "Placing orders",
    items: [
      {
        q: "How do I buy a stock?",
        a: "Hover over a stock in the watchlist and press B. In the order window, enter a quantity, choose Delivery (CNC) or Intraday (MIS), and press Buy. On a phone, open Watchlist from the menu and tap B.",
      },
      {
        q: "How do I sell?",
        a: "Press S next to the stock in the watchlist, or the Sell button on its row in Holdings or Positions. You can only sell shares you own: delivery sales come out of Holdings, intraday sales out of Positions.",
      },
      {
        q: "What's the difference between Market and Limit?",
        a: "A Market order uses the current price. A Limit order uses the price you type in. On Vittora both go through straight away, but a limit price must be within 10% of the current price.",
      },
      {
        q: "Why was my order rejected?",
        a: "The order window tells you the exact reason. The usual ones are not having enough cash for a buy, trying to sell more shares than you hold, a quantity that isn't a whole number, or a limit price more than 10% away from the market.",
      },
      {
        q: "Are the prices real?",
        a: "They're sample prices for real Indian companies. Each one moves a little every few seconds by a fixed pattern, so the desk feels alive, but they don't follow the actual market.",
      },
    ],
  },
  {
    topic: "Funds and charges",
    items: [
      {
        q: "How much brokerage does Vittora charge?",
        a: "Delivery orders are free. Intraday orders cost ₹20 or 0.03% of the order value, whichever is lower. The order window shows the brokerage before you confirm.",
      },
      {
        q: "How do I add or withdraw money?",
        a: "Open Funds in the dashboard, type an amount or pick a quick amount, and press Add funds or Withdraw. It's demo money, so nothing touches a bank account.",
      },
    ],
  },
  {
    topic: "Your data",
    items: [
      {
        q: "Do I need to log in?",
        a: "No. The demo uses one shared practice account, so everyone who opens the dashboard sees the same portfolio. Your display name is saved only in your own browser.",
      },
      {
        q: "Can I reset the portfolio?",
        a: "Not from the dashboard yet. If you run Vittora yourself without a database, it starts fresh every time the server restarts.",
      },
    ],
  },
];

function Faq({ groups, query }) {
  return (
    <section className="section">
      <div className="site-container faq">
        {groups.length === 0 ? (
          <div className="faq-empty">
            <h2>No answers match “{query}”</h2>
            <p>Try a shorter word, like “sell” or “funds”, or ask your question on GitHub.</p>
          </div>
        ) : (
          groups.map((group) => (
            <div className="faq-group" key={group.topic}>
              <h2>{group.topic}</h2>
              {group.items.map((item) => (
                <details key={item.q} open={Boolean(query)}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          ))
        )}

        <div className="faq-more">
          <h2>Still stuck?</h2>
          <p>
            Report a bug or ask a question in the project's <a href={`${REPO_URL}/issues`}>GitHub issues</a>.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Faq;

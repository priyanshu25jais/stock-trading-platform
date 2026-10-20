import React, { useEffect, useRef, useState } from "react";

import { useTrading } from "./GeneralContext";
import { errorMessage } from "../api";
import { inr, rupees, signedPct, tone } from "../format";

import "./BuyActionWindow.css";

// Order window for buying and selling. Opens from the watchlist, holdings
// and positions; one window is open at a time.
const BuyActionWindow = () => {
  const { ticket, closeTicket, quoteMap, funds, holdings, positions, placeOrder } = useTrading();
  const quote = quoteMap[ticket.symbol];

  const [mode, setMode] = useState(ticket.mode);
  const [product, setProduct] = useState(ticket.product || "CNC");
  const [orderType, setOrderType] = useState("MARKET");
  const [qty, setQty] = useState("1");
  const [limitPrice, setLimitPrice] = useState(quote ? quote.price.toFixed(2) : "");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const qtyRef = useRef(null);

  useEffect(() => {
    qtyRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && closeTicket();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeTicket]);

  if (!quote) return null;

  const isBuy = mode === "BUY";
  const price = orderType === "MARKET" ? quote.price : Number(limitPrice);
  const qtyNumber = Number(qty);
  const value = Number.isFinite(price) && Number.isFinite(qtyNumber) ? price * qtyNumber : 0;
  // Same rule as the server: delivery is free, intraday is ₹20 or 0.03%, whichever is lower.
  const brokerage = product === "MIS" ? Math.round(Math.min(20, value * 0.0003) * 100) / 100 : 0;
  const needed = value + brokerage;
  const held = (product === "MIS" ? positions : holdings).find((row) => row.name === ticket.symbol)?.qty || 0;

  function validate() {
    if (!Number.isInteger(qtyNumber) || qtyNumber < 1) return "Enter a quantity of at least 1 share.";
    if (orderType === "LIMIT" && (!Number.isFinite(price) || price <= 0))
      return "Enter a limit price above ₹0.";
    if (isBuy && funds && needed > funds.available) {
      return `Not enough funds. This order needs ${rupees(needed)} and you have ${rupees(funds.available)} available.`;
    }
    if (!isBuy && qtyNumber > held) {
      return held
        ? `You can sell at most ${held} ${ticket.symbol} here.`
        : `You don't have any ${ticket.symbol} ${product === "MIS" ? "in intraday positions" : "in your holdings"} to sell.`;
    }
    return "";
  }

  async function submit(e) {
    e.preventDefault();
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await placeOrder({
        name: ticket.symbol,
        qty: qtyNumber,
        price: Number(price.toFixed(2)),
        mode,
        product,
      });
      closeTicket();
    } catch (err) {
      setError(errorMessage(err));
      setSubmitting(false);
    }
  }

  const titleId = "order-window-title";

  return (
    <section
      className={`order-window ${isBuy ? "is-buy" : "is-sell"}`}
      role="dialog"
      aria-labelledby={titleId}
    >
      <header className="ow-header">
        <div>
          <h2 id={titleId} className="ow-title">
            {isBuy ? "Buy" : "Sell"} {ticket.symbol}
            <span className="ow-exchange">{quote.exchange}</span>
          </h2>
          <p className="ow-ltp">
            <span className="num">{rupees(quote.price)}</span>{" "}
            <span className={`num ow-change ${tone(quote.change)}`}>{signedPct(quote.changePercent)}</span>
          </p>
        </div>
        <div className="ow-mode" role="radiogroup" aria-label="Buy or sell">
          {["BUY", "SELL"].map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={mode === m}
              className={mode === m ? "selected" : ""}
              onClick={() => {
                setMode(m);
                setError("");
              }}
            >
              {m === "BUY" ? "Buy" : "Sell"}
            </button>
          ))}
        </div>
      </header>

      <form className="ow-body" onSubmit={submit} noValidate>
        <fieldset className="ow-choice">
          <legend>Product</legend>
          <label>
            <input
              type="radio"
              name="product"
              value="CNC"
              checked={product === "CNC"}
              onChange={() => setProduct("CNC")}
            />
            Delivery <span className="ow-hint">CNC</span>
          </label>
          <label>
            <input
              type="radio"
              name="product"
              value="MIS"
              checked={product === "MIS"}
              onChange={() => setProduct("MIS")}
            />
            Intraday <span className="ow-hint">MIS</span>
          </label>
        </fieldset>

        <div className="ow-fields">
          <div className="ow-field">
            <label htmlFor="ow-qty">Quantity</label>
            <input
              id="ow-qty"
              ref={qtyRef}
              type="number"
              inputMode="numeric"
              min="1"
              step="1"
              value={qty}
              onChange={(e) => {
                setQty(e.target.value);
                setError("");
              }}
            />
          </div>

          <div className="ow-field">
            <label htmlFor="ow-price">Price</label>
            <input
              id="ow-price"
              type="number"
              inputMode="decimal"
              min="0.05"
              step="0.05"
              disabled={orderType === "MARKET"}
              value={orderType === "MARKET" ? quote.price.toFixed(2) : limitPrice}
              onChange={(e) => {
                setLimitPrice(e.target.value);
                setError("");
              }}
            />
          </div>

          <fieldset className="ow-choice ow-type">
            <legend>Order type</legend>
            <label>
              <input
                type="radio"
                name="orderType"
                value="MARKET"
                checked={orderType === "MARKET"}
                onChange={() => setOrderType("MARKET")}
              />
              Market
            </label>
            <label>
              <input
                type="radio"
                name="orderType"
                value="LIMIT"
                checked={orderType === "LIMIT"}
                onChange={() => {
                  setOrderType("LIMIT");
                  setLimitPrice(quote.price.toFixed(2));
                }}
              />
              Limit
            </label>
          </fieldset>
        </div>

        <dl className="ow-facts">
          <div>
            <dt>Order value</dt>
            <dd className="num">{rupees(value)}</dd>
          </div>
          <div>
            <dt>Brokerage</dt>
            <dd className="num">{brokerage ? rupees(brokerage) : "Free on delivery"}</dd>
          </div>
          {isBuy ? (
            <div>
              <dt>Available cash</dt>
              <dd className="num">{funds ? rupees(funds.available) : "—"}</dd>
            </div>
          ) : (
            <div>
              <dt>You hold</dt>
              <dd className="num">
                {held} {product === "MIS" ? "intraday" : "in holdings"}
              </dd>
            </div>
          )}
        </dl>

        <p className="ow-error" role="alert" aria-live="assertive">
          {error}
        </p>

        <div className="ow-actions">
          <button type="submit" className={`btn ${isBuy ? "btn-buy" : "btn-sell"}`} disabled={submitting}>
            {submitting
              ? "Placing order…"
              : `${isBuy ? "Buy" : "Sell"} ${inr(qtyNumber || 0).replace(".00", "")} ${ticket.symbol}`}
          </button>
          <button type="button" className="btn btn-quiet" onClick={closeTicket}>
            Cancel
          </button>
        </div>
        <p className="ow-note">Simulated order. No real money or shares move.</p>
      </form>
    </section>
  );
};

export default BuyActionWindow;

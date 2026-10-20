import React, { useState } from "react";

const inr = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const rupees = (n) => `₹${inr.format(n)}`;

// Same rule the Vittora API uses.
export function brokerageFor(product, value) {
  if (product !== "MIS") return 0;
  return Math.round(Math.min(20, value * 0.0003) * 100) / 100;
}

function Brokerage() {
  const [product, setProduct] = useState("MIS");
  const [qty, setQty] = useState("50");
  const [price, setPrice] = useState("1550");

  const q = Number(qty);
  const p = Number(price);
  const valid = Number.isFinite(q) && q > 0 && Number.isFinite(p) && p > 0;
  const value = valid ? q * p : 0;
  const brokerage = brokerageFor(product, value);

  return (
    <section className="section section-tinted">
      <div className="site-container split split-top">
        <div>
          <h2 className="section-title">Brokerage calculator</h2>
          <p>Work out what an order will cost before you place it on the desk.</p>
          <p className="small-print">
            Vittora only simulates brokerage. Real trades also attract taxes and exchange charges such as STT,
            GST and stamp duty, which this demo doesn't apply.
          </p>
        </div>

        <form className="calculator" onSubmit={(e) => e.preventDefault()}>
          <fieldset className="calc-choice">
            <legend>Product</legend>
            <div className="segmented">
              <label className={product === "CNC" ? "is-on" : ""}>
                <input
                  type="radio"
                  name="calc-product"
                  value="CNC"
                  checked={product === "CNC"}
                  onChange={() => setProduct("CNC")}
                />
                Delivery (CNC)
              </label>
              <label className={product === "MIS" ? "is-on" : ""}>
                <input
                  type="radio"
                  name="calc-product"
                  value="MIS"
                  checked={product === "MIS"}
                  onChange={() => setProduct("MIS")}
                />
                Intraday (MIS)
              </label>
            </div>
          </fieldset>

          <div className="calc-fields">
            <label>
              Quantity
              <input
                type="number"
                min="1"
                step="1"
                inputMode="numeric"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
              />
            </label>
            <label>
              Price per share (₹)
              <input
                type="number"
                min="0.05"
                step="0.05"
                inputMode="decimal"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </label>
          </div>

          <dl className="calc-result" aria-live="polite">
            <div>
              <dt>Order value</dt>
              <dd className="num">{rupees(value)}</dd>
            </div>
            <div>
              <dt>Brokerage</dt>
              <dd className="num">{rupees(brokerage)}</dd>
            </div>
            <div className="calc-total">
              <dt>Total for a buy order</dt>
              <dd className="num">{rupees(value + brokerage)}</dd>
            </div>
          </dl>
          {!valid && <p className="form-error">Enter a quantity and a price above zero.</p>}
        </form>
      </div>
    </section>
  );
}

export default Brokerage;

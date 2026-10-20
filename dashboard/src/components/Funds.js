import React, { useState } from "react";

import { useTrading } from "./GeneralContext";
import { errorMessage } from "../api";
import { rupees } from "../format";

const QUICK = [5000, 10000, 25000];

function FundsForm() {
  const { moveFunds } = useTrading();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");

  async function run(direction) {
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setError("Enter an amount more than ₹0.");
      return;
    }
    setBusy(direction);
    setError("");
    try {
      await moveFunds(direction, value);
      setAmount("");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy("");
    }
  }

  return (
    <form className="funds-form" onSubmit={(e) => e.preventDefault()} noValidate>
      <label htmlFor="funds-amount">Amount</label>
      <div className="funds-input">
        <span aria-hidden="true">₹</span>
        <input
          id="funds-amount"
          type="number"
          inputMode="decimal"
          min="1"
          step="1"
          placeholder="10,000"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setError("");
          }}
        />
      </div>
      <div className="quick-amounts" aria-label="Quick amounts">
        {QUICK.map((q) => (
          <button key={q} type="button" className="chip" onClick={() => setAmount(String(q))}>
            ₹{q.toLocaleString("en-IN")}
          </button>
        ))}
      </div>
      <p className="form-error" role="alert">
        {error}
      </p>
      <div className="funds-actions">
        <button type="button" className="btn btn-buy" disabled={!!busy} onClick={() => run("add")}>
          {busy === "add" ? "Adding…" : "Add funds"}
        </button>
        <button type="button" className="btn btn-outline" disabled={!!busy} onClick={() => run("withdraw")}>
          {busy === "withdraw" ? "Withdrawing…" : "Withdraw"}
        </button>
      </div>
      <p className="form-note">Demo money only. Nothing is charged to or paid into a bank account.</p>
    </form>
  );
}

const Funds = () => {
  const { funds } = useTrading();
  if (!funds) return null;

  const rows = [
    ["Opening balance", funds.openingBalance],
    ["Added (pay-in)", funds.payin],
    ["Withdrawn (pay-out)", funds.payout],
    ["Used margin (intraday positions)", funds.usedMargin],
    ["Invested in holdings (at cost)", funds.invested],
    ["Holdings at current prices", funds.holdingsValue],
  ];

  return (
    <div className="page">
      <header className="page-head page-head-row">
        <h1 className="page-title">Funds</h1>
        <p className="page-sub">Cash in your demo account and how it has moved.</p>
      </header>

      <div className="funds-grid">
        <section aria-labelledby="cash-h">
          <h2 id="cash-h" className="block-title">
            Available cash
          </h2>
          <p className="figure num">{rupees(funds.available)}</p>
          <p className="figure-label">Ready to use for buy orders</p>
          <dl className="ledger">
            {rows.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd className="num">{rupees(value)}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="move-h" className="funds-panel">
          <h2 id="move-h" className="block-title">
            Add or withdraw
          </h2>
          <FundsForm />
        </section>
      </div>
    </div>
  );
};

export default Funds;

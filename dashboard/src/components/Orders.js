import React from "react";

import { useTrading } from "./GeneralContext";
import { rupees, time } from "../format";

const Orders = () => {
  const { orders } = useTrading();

  return (
    <div className="page">
      <header className="page-head page-head-row">
        <h1 className="page-title">Orders ({orders.length})</h1>
        <p className="page-sub">Every order placed on this demo account, newest first.</p>
      </header>

      {orders.length === 0 ? (
        <div className="empty-block">
          <h2>No orders yet</h2>
          <p>
            Pick a stock in the watchlist and press <strong>B</strong> to buy or <strong>S</strong> to sell.
            Your orders will be listed here.
          </p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Time</th>
                <th scope="col">Type</th>
                <th scope="col">Instrument</th>
                <th scope="col">Product</th>
                <th scope="col">Qty.</th>
                <th scope="col">Price</th>
                <th scope="col">Value</th>
                <th scope="col">Brokerage</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td className="muted">{time(o.createdAt)}</td>
                  <td>
                    <span className={`badge badge-${String(o.mode).toLowerCase()}`}>{o.mode}</span>
                  </td>
                  <th scope="row">{o.name}</th>
                  <td>{o.product}</td>
                  <td className="num">{o.qty}</td>
                  <td className="num">{rupees(o.price)}</td>
                  <td className="num">{rupees(o.qty * o.price)}</td>
                  <td className="num">{o.brokerage ? rupees(o.brokerage) : "₹0"}</td>
                  <td>
                    <span className="status-complete">Complete</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;

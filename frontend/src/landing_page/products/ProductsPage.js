import React from "react";

import Hero from "./Hero";
import FeatureRow from "./FeatureRow";
import ApiSection from "./ApiSection";
import OpenAccount from "../OpenAccount";

const ROWS = [
  {
    title: "Watchlist and order window",
    text: "Search the watchlist by symbol or company name. Hover over a stock and press B or S to open the order window, choose Delivery or Intraday, Market or Limit, and see the order value and brokerage before you confirm.",
    image: "desk-order.webp",
    alt: "Vittora order window open to buy shares of Infosys, showing quantity, price, order value and brokerage",
  },
  {
    title: "Holdings and P&L",
    text: "Every share you own, with average cost, last traded price, current value and profit or loss. A chart shows which holdings are up and which are down.",
    image: "desk-holdings.webp",
    alt: "Holdings table listing thirteen stocks with quantity, average cost, last price and profit or loss",
  },
  {
    title: "Orders and positions",
    text: "A log of every order you place, newest first, with its price, value and brokerage. Intraday trades you haven't closed yet appear under Positions.",
    image: "desk-orders.webp",
    alt: "Orders page listing buy and sell orders with time, instrument, quantity, price and status",
  },
  {
    title: "Funds",
    text: "See the cash you have available to trade, add or withdraw demo money, and follow how your opening balance has moved.",
    image: "desk-funds.webp",
    alt: "Funds page showing available cash, a ledger of fund movements and a form to add or withdraw money",
  },
];

function ProductsPage() {
  return (
    <>
      <Hero />
      {ROWS.map((row, i) => (
        <FeatureRow key={row.title} {...row} reverse={i % 2 === 1} />
      ))}
      <ApiSection />
      <OpenAccount title="Try the desk with demo money" />
    </>
  );
}

export default ProductsPage;

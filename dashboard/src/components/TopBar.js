import React from "react";

import Menu from "./Menu";
import { useTrading } from "./GeneralContext";
import { inr, signedPct, tone } from "../format";

function Index({ index }) {
  return (
    <div className="index">
      <span className="index-name">{index.symbol}</span>
      <span className="index-price num">{inr(index.price)}</span>
      <span className={`index-change num ${tone(index.change)}`}>{signedPct(index.changePercent)}</span>
    </div>
  );
}

const TopBar = () => {
  const { quotes } = useTrading();
  return (
    <header className="topbar">
      <Menu />
      <div className="indices" aria-label="Market indices">
        {quotes.indices.map((index) => (
          <Index key={index.symbol} index={index} />
        ))}
      </div>
    </header>
  );
};

export default TopBar;

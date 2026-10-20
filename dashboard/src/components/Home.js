import React from "react";

import TopBar from "./TopBar";
import Dashboard from "./Dashboard";
import BuyActionWindow from "./BuyActionWindow";
import Toast from "./Toast";
import { GeneralContextProvider, useTrading } from "./GeneralContext";

function Shell() {
  const { ticket } = useTrading();
  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <TopBar />
      <Dashboard />
      {ticket && <BuyActionWindow key={ticket.id} />}
      <Toast />
    </div>
  );
}

const Home = () => (
  <GeneralContextProvider>
    <Shell />
  </GeneralContextProvider>
);

export default Home;

import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Apps from "./Apps";
import Funds from "./Funds";
import Holdings from "./Holdings";
import Orders from "./Orders";
import Positions from "./Positions";
import Summary from "./Summary";
import WatchList from "./WatchList";
import { useTrading } from "./GeneralContext";

function Connecting() {
  const { slow } = useTrading();
  return (
    <div className="state-panel" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <h2>Connecting to the Vittora server</h2>
      {slow ? (
        <p>
          The free server goes to sleep when nobody is using it. Waking it up can take up to a minute; this
          page will load on its own.
        </p>
      ) : (
        <p>Loading prices, holdings and funds.</p>
      )}
    </div>
  );
}

function Unreachable() {
  const { loadError, reload } = useTrading();
  return (
    <div className="state-panel" role="alert">
      <h2>Couldn't load your dashboard</h2>
      <p>{loadError}</p>
      <button type="button" className="btn btn-primary" onClick={reload}>
        Try again
      </button>
    </div>
  );
}

const Dashboard = () => {
  const { status } = useTrading();

  let content;
  if (status === "loading") content = <Connecting />;
  else if (status === "error") content = <Unreachable />;
  else
    content = (
      <Routes>
        <Route index element={<Summary />} />
        <Route path="orders" element={<Orders />} />
        <Route path="holdings" element={<Holdings />} />
        <Route path="positions" element={<Positions />} />
        <Route path="funds" element={<Funds />} />
        <Route path="apps" element={<Apps />} />
        <Route
          path="watchlist"
          element={
            <>
              <div className="mobile-only">
                <WatchList />
              </div>
              <div className="desktop-only">
                <Summary />
              </div>
            </>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );

  return (
    <div className="workspace">
      <aside className="watchlist-pane" aria-label="Watchlist">
        {status === "ready" && <WatchList />}
      </aside>
      <main id="main" className="content" tabIndex={-1}>
        {content}
      </main>
    </div>
  );
};

export default Dashboard;

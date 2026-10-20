import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import Home from "./components/Home";
import { api } from "./api";
import { compact, signedPct } from "./format";

jest.mock("./api", () => ({
  API_BASE: "http://test-api",
  SITE_URL: "http://test-site",
  errorMessage: (err) => err?.response?.data?.error || "Couldn't reach the Vittora server.",
  api: {
    health: jest.fn(),
    quotes: jest.fn(),
    holdings: jest.fn(),
    positions: jest.fn(),
    orders: jest.fn(),
    funds: jest.fn(),
    placeOrder: jest.fn(),
    addFunds: jest.fn(),
    withdrawFunds: jest.fn(),
  },
}));

// Charts need a real canvas; the tests only care about the numbers around them.
jest.mock("./components/VerticalGraph", () => () => <div data-testid="pnl-chart" />);
jest.mock("./components/AllocationChart", () => () => <div data-testid="allocation-chart" />);

const QUOTES = {
  asOf: "2026-10-20T06:00:00.000Z",
  indices: [
    { symbol: "NIFTY 50", price: 22200, change: 53, changePercent: 0.24 },
    { symbol: "SENSEX", price: 72900, change: -20, changePercent: -0.03 },
  ],
  instruments: [
    {
      symbol: "INFY",
      name: "Infosys",
      exchange: "NSE",
      price: 1550,
      prevClose: 1580,
      change: -30,
      changePercent: -1.9,
    },
    {
      symbol: "TCS",
      name: "Tata Consultancy Services",
      exchange: "NSE",
      price: 3200,
      prevClose: 3190,
      change: 10,
      changePercent: 0.31,
    },
  ],
};

const HOLDINGS = [{ _id: "h1", name: "INFY", qty: 2, avg: 1350, price: 1550, day: "-1.90%" }];
const FUNDS = {
  openingBalance: 100000,
  available: 5000,
  usedMargin: 0,
  payin: 0,
  payout: 0,
  invested: 2700,
  holdingsValue: 3100,
};

function renderAt(path = "/") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/*" element={<Home />} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  window.localStorage.clear();
  api.quotes.mockResolvedValue(QUOTES);
  api.holdings.mockResolvedValue(HOLDINGS);
  api.positions.mockResolvedValue([]);
  api.orders.mockResolvedValue([]);
  api.funds.mockResolvedValue(FUNDS);
  api.health.mockResolvedValue({ ok: true, service: "vittora-api", storage: "mongodb" });
});

test("format helpers use Indian number style", () => {
  expect(compact(374250)).toBe("3.74L");
  expect(compact(29875.55)).toBe("29.88k");
  expect(signedPct(-1.234)).toBe("−1.23%");
});

test("summary loads holdings, funds and the watchlist", async () => {
  renderAt("/");
  expect(screen.getByText(/connecting to the vittora server/i)).toBeInTheDocument();
  expect(await screen.findByText("Holdings (1)")).toBeInTheDocument();
  // INFY: 2 x (1550 - 1350) = +400 P&L
  expect(screen.getByText("+400.00")).toBeInTheDocument();
  expect(screen.getByText("Cash available to trade")).toBeInTheDocument();
  const watchlist = screen.getByLabelText("Watchlist");
  expect(within(watchlist).getByText("TCS")).toBeInTheDocument();
});

test("a failed load shows the reason and a retry button", async () => {
  api.holdings.mockRejectedValueOnce({ request: {} });
  renderAt("/");
  expect(await screen.findByRole("heading", { name: /couldn't load your dashboard/i })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Try again" }));
  expect(await screen.findByText("Holdings (1)")).toBeInTheDocument();
});

test("watchlist search filters by symbol or company name", async () => {
  renderAt("/");
  const watchlist = await screen.findByLabelText("Watchlist");
  await within(watchlist).findByText("INFY");
  fireEvent.change(within(watchlist).getByLabelText("Search stocks"), { target: { value: "tata" } });
  expect(within(watchlist).queryByText("INFY")).not.toBeInTheDocument();
  expect(within(watchlist).getByText("TCS")).toBeInTheDocument();
});

test("buying from the watchlist sends the order to the API", async () => {
  api.placeOrder.mockResolvedValue({
    message: "Bought 2 TCS at ₹3,200.00.",
    order: {},
    funds: { ...FUNDS, available: -1400 },
  });
  renderAt("/");
  const watchlist = await screen.findByLabelText("Watchlist");
  // Not enough cash for 2 x 3200 = 6400 with 5000 available: blocked before calling the API.
  fireEvent.click(await within(watchlist).findByRole("button", { name: "Buy TCS" }));
  const dialog = screen.getByRole("dialog", { name: /buy tcs/i });
  fireEvent.change(within(dialog).getByLabelText("Quantity"), { target: { value: "2" } });
  fireEvent.click(within(dialog).getByRole("button", { name: "Buy 2 TCS" }));
  expect(within(dialog).getByRole("alert")).toHaveTextContent(/not enough funds/i);
  expect(api.placeOrder).not.toHaveBeenCalled();

  fireEvent.change(within(dialog).getByLabelText("Quantity"), { target: { value: "1" } });
  fireEvent.click(within(dialog).getByRole("button", { name: "Buy 1 TCS" }));
  await waitFor(() =>
    expect(api.placeOrder).toHaveBeenCalledWith({
      name: "TCS",
      qty: 1,
      price: 3200,
      mode: "BUY",
      product: "CNC",
    }),
  );
  expect(await screen.findByText("Bought 2 TCS at ₹3,200.00.")).toBeInTheDocument();
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("selling more than you hold is caught in the order window", async () => {
  renderAt("/holdings");
  const sell = await screen.findByRole("button", { name: "Sell" });
  fireEvent.click(sell);
  const dialog = screen.getByRole("dialog", { name: /sell infy/i });
  fireEvent.change(within(dialog).getByLabelText("Quantity"), { target: { value: "5" } });
  fireEvent.click(within(dialog).getByRole("button", { name: "Sell 5 INFY" }));
  expect(within(dialog).getByRole("alert")).toHaveTextContent("You can sell at most 2 INFY here.");
  expect(api.placeOrder).not.toHaveBeenCalled();
});

test("server errors from an order are shown in the window", async () => {
  api.placeOrder.mockRejectedValue({
    response: { data: { error: "Price must be within 10% of the last price." } },
  });
  renderAt("/");
  const watchlist = await screen.findByLabelText("Watchlist");
  fireEvent.click(await within(watchlist).findByRole("button", { name: "Buy INFY" }));
  const dialog = screen.getByRole("dialog");
  fireEvent.click(within(dialog).getByRole("button", { name: "Buy 1 INFY" }));
  expect(await within(dialog).findByText("Price must be within 10% of the last price.")).toBeInTheDocument();
});

test("intraday orders show brokerage before you confirm", async () => {
  renderAt("/");
  const watchlist = await screen.findByLabelText("Watchlist");
  fireEvent.click(await within(watchlist).findByRole("button", { name: "Buy INFY" }));
  const dialog = screen.getByRole("dialog");
  expect(within(dialog).getByText("Free on delivery")).toBeInTheDocument();
  fireEvent.click(within(dialog).getByLabelText(/intraday/i));
  // 1 x 1550 x 0.03% = ₹0.47 (below the ₹20 cap)
  expect(within(dialog).getByText("₹0.47")).toBeInTheDocument();
});

test("funds page validates the amount and adds money", async () => {
  api.addFunds.mockResolvedValue({
    message: "Added ₹5,000.00 to your account.",
    funds: { ...FUNDS, available: 10000, payin: 5000 },
  });
  renderAt("/funds");
  fireEvent.click(await screen.findByRole("button", { name: "Add funds" }));
  expect(screen.getByRole("alert")).toHaveTextContent(/more than ₹0/);
  fireEvent.click(screen.getByRole("button", { name: "₹5,000" }));
  fireEvent.click(screen.getByRole("button", { name: "Add funds" }));
  await waitFor(() => expect(api.addFunds).toHaveBeenCalledWith(5000));
  expect(await screen.findByText("₹10,000.00")).toBeInTheDocument();
});

test("orders page shows an empty state, then the orders", async () => {
  const { unmount } = renderAt("/orders");
  expect(await screen.findByRole("heading", { name: "No orders yet" })).toBeInTheDocument();
  unmount();

  api.orders.mockResolvedValue([
    {
      _id: "o1",
      name: "TCS",
      qty: 1,
      price: 3200,
      mode: "BUY",
      product: "CNC",
      brokerage: 0,
      createdAt: new Date().toISOString(),
    },
  ]);
  renderAt("/orders");
  expect(await screen.findByText("Orders (1)")).toBeInTheDocument();
  expect(screen.getByRole("rowheader", { name: "TCS" })).toBeInTheDocument();
});

test("the display name from sign-up is saved and shown", async () => {
  window.history.replaceState(null, "", "/?name=Priyanshu");
  renderAt("/");
  expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent(", Priyanshu");
  expect(window.localStorage.getItem("vittora.name")).toBe("Priyanshu");
  expect(window.location.search).toBe("");
});

test("apps page reports the API status", async () => {
  renderAt("/apps");
  expect(await screen.findByText(/storage: mongodb/i)).toBeInTheDocument();
});

test("the technical page is in the profile menu, not the main menu", async () => {
  renderAt("/");
  await screen.findByText("Holdings (1)");
  const nav = screen.getByRole("navigation", { name: "Dashboard sections" });
  expect(within(nav).queryByRole("link", { name: "Apps" })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /guest/i }));
  fireEvent.click(screen.getByRole("menuitem", { name: "How Vittora works" }));
  expect(await screen.findByRole("heading", { name: "How Vittora works" })).toBeInTheDocument();
});

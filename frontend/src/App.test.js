import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import App from "./App";
import { brokerageFor } from "./landing_page/pricing/Brokerage";
import { dashboardLink } from "./landing_page/links";

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

// CRA resets mocks before every test, so set them up each time.
beforeEach(() => {
  window.scrollTo = jest.fn();
  global.fetch = jest.fn(() => Promise.reject(new Error("offline in tests")));
});

test("home page shows the Vittora hero and main navigation", () => {
  renderAt("/");
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/learn to trade/i);
  const nav = screen.getByRole("navigation", { name: "Main" });
  for (const label of ["Products", "Pricing", "About", "Support", "Sign up"]) {
    expect(within(nav).getByRole("link", { name: label })).toBeInTheDocument();
  }
  expect(document.title).toMatch(/Vittora/);
});

test("no page mentions Zerodha any more", () => {
  for (const path of ["/", "/about", "/product", "/pricing", "/support", "/signup"]) {
    const { container, unmount } = renderAt(path);
    expect(container.textContent).not.toMatch(/zerodha|kite|nithin/i);
    unmount();
  }
});

test("footer says clearly that Vittora is a demo, not a broker", () => {
  renderAt("/");
  expect(screen.getByText(/not a stock broker/i)).toBeInTheDocument();
});

test("unknown pages show the 404 page", () => {
  renderAt("/does-not-exist");
  expect(screen.getByRole("heading", { name: /this page doesn't exist/i })).toBeInTheDocument();
});

test("brokerage rule matches the API: free delivery, intraday ₹20 or 0.03%", () => {
  expect(brokerageFor("CNC", 1000000)).toBe(0);
  expect(brokerageFor("MIS", 10000)).toBe(3);
  expect(brokerageFor("MIS", 1000000)).toBe(20);
});

test("pricing calculator updates as you type", () => {
  renderAt("/pricing");
  fireEvent.change(screen.getByLabelText("Quantity"), { target: { value: "10" } });
  fireEvent.change(screen.getByLabelText(/price per share/i), { target: { value: "1000" } });
  // 10 x 1000 = 10,000 intraday -> 0.03% = ₹3
  expect(screen.getByText("₹3.00")).toBeInTheDocument();
  fireEvent.click(screen.getByLabelText("Delivery (CNC)"));
  expect(screen.getAllByText("₹10,000.00").length).toBe(2);
});

test("support search filters the questions", () => {
  renderAt("/support");
  fireEvent.change(screen.getByLabelText("Search help"), { target: { value: "brokerage" } });
  expect(screen.getByText("How much brokerage does Vittora charge?")).toBeInTheDocument();
  expect(screen.queryByText("How do I open an account?")).not.toBeInTheDocument();

  fireEvent.change(screen.getByLabelText("Search help"), { target: { value: "xyzzy" } });
  expect(screen.getByRole("heading", { name: /no answers match/i })).toBeInTheDocument();
});

test("sign up asks for a name before opening the dashboard", () => {
  renderAt("/signup");
  fireEvent.click(screen.getByRole("button", { name: "Open my dashboard" }));
  expect(screen.getByRole("alert")).toHaveTextContent(/at least 2 characters/i);
});

test("dashboard link carries the display name", () => {
  expect(dashboardLink("Priya Shah")).toMatch(/\/\?name=Priya%20Shah$/);
  expect(dashboardLink("  ")).toMatch(/\/$/);
});

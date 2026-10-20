# Vittora: a practice stock trading platform

Vittora is a full-stack demo brokerage for Indian stocks. People can watch sample NSE and BSE prices move,
place simulated delivery and intraday orders, and track holdings, positions, orders, funds and P&L.

It has three parts: a marketing **website**, a trading **dashboard** (Vittora Desk), and a REST **API**
that stores the account in MongoDB and checks every order.

> Vittora is a student portfolio project, not a stock broker. It is not registered with SEBI or any
> exchange, prices are sample data with simulated movement, and every order is simulated.

## Live demo

| Part                     | URL                                            |
| ------------------------ | ---------------------------------------------- |
| Website                  | https://stock-tradingplatform.netlify.app      |
| Dashboard (Vittora Desk) | https://stock-tradingdashboard.netlify.app     |
| API                      | https://stock-trading-platform-wezz.onrender.com |

The API runs on Render's free plan, which sleeps when idle. The first request after a quiet spell can take
up to a minute; the dashboard shows a "waking up" message while it waits.

## Features

**Website** (`frontend/`)

- Home, Products, Pricing, About, Support and Sign up pages, plus a 404 page
- Brokerage calculator on the Pricing page (same rule as the API)
- Searchable FAQ on the Support page
- Sign up asks for a display name and opens the dashboard with it

**Dashboard** (`dashboard/`)

- Watchlist of 17 stocks with search, live-updating prices and NIFTY 50 / SENSEX in the top bar
- Order window: Buy or Sell, Delivery (CNC) or Intraday (MIS), Market or Limit, with order value,
  brokerage and available cash shown before you confirm
- Holdings with average cost, LTP, current value, P&L, net and day change, and a P&L chart
- Positions (open intraday trades), Orders (full log, newest first), Funds (add and withdraw demo money)
- Summary page with cash, total P&L, "where your money is" chart and recent orders
- "How Vittora works" page (in the menu under your name) showing how the three parts connect and whether the API is reachable
- Works on phones: scrollable menu, Watchlist tab and a bottom-sheet order window

**API** (`backend/`)

- Validates every order: known stock, whole-number quantity (1 to 10,000), price within 10% of the last
  price, enough cash for buys, enough shares for sells
- Buying updates quantity and average cost; selling reduces or removes the holding
- Brokerage: delivery free, intraday ₹20 or 0.03% per order, whichever is lower
- Deterministic price simulation, so every request sees the same price at the same moment
- Seeds sample holdings, positions and ₹1,00,000 of cash into an empty database
- Runs without MongoDB using an in-memory store (handy for local development and tests)

## Tech stack

| Layer     | Technology                                              |
| --------- | ------------------------------------------------------- |
| Website   | React 18, React Router 7, Bootstrap 5 (base styles)      |
| Dashboard | React 18, React Router 6, Axios, Chart.js               |
| API       | Node.js 18+, Express 4, Mongoose 8                      |
| Database  | MongoDB Atlas                                           |
| Hosting   | Netlify (website and dashboard), Render (API)           |
| Tests     | Node's built-in test runner, Jest and Testing Library   |

## Project structure

```text
stock-trading-platform/
├── frontend/                 Website (React)
│   ├── public/media/images/  Dashboard screenshots used on the site
│   └── src/landing_page/     Pages: home, products, pricing, about, support, signup
├── dashboard/                Vittora Desk (React)
│   └── src/components/       TopBar, WatchList, BuyActionWindow (order window), pages
├── backend/                  Vittora API (Express)
│   ├── app.js                Routes and error handling
│   ├── index.js              Starts the server with MongoDB or the in-memory store
│   ├── services/trading.js   Order, funds and P&L rules
│   ├── data/market.js        Instruments and the price simulator
│   ├── data/seed.js          Starting holdings, positions and cash
│   ├── store/                memoryStore.js and mongoStore.js (same interface)
│   ├── schemas/, model/      Mongoose schemas and models
│   └── test/api.test.js      API tests
├── package.json              npm run setup / dev / test for all three apps
├── netlify.toml              Netlify build for the website
└── render.yaml               Render settings for the API
```

## Run it locally

You need [Node.js](https://nodejs.org) 18 or newer and Git. Open a terminal in the project folder.

```bash
npm run setup   # first time only: installs packages for all three apps
npm run dev     # starts the API (3002), dashboard (3001) and website (3000) together
```

The website opens at http://localhost:3000 and the dashboard at http://localhost:3001. Press `Ctrl + C` in
the terminal to stop everything.

`npm run dev` points the local apps at each other (see `dashboard/scripts/start-local.js` and
`frontend/scripts/start-local.js`). Plain `npm start` inside an app, and the Netlify builds, use the live URLs.

**Database.** Without a database the API uses in-memory sample data that resets on every restart. To use
MongoDB Atlas, create `backend/.env` (copy `backend/env.example`) with your connection string:

```env
MONGO_URL=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/vittora?retryWrites=true&w=majority
```

`backend/.env` is ignored by Git, so your password is never uploaded. On first start an empty database is
filled with sample holdings, positions and ₹1,00,000 of demo cash.

Run all tests with `npm test`.

## Environment variables

| App       | Variable                  | Purpose                                                   |
| --------- | ------------------------- | --------------------------------------------------------- |
| backend   | `MONGO_URL`               | MongoDB connection string; leave unset for in-memory data  |
| backend   | `CORS_ORIGIN`             | Optional comma-separated list of allowed sites             |
| backend   | `PORT`                    | Set automatically by Render; defaults to 3002              |
| dashboard | `REACT_APP_API_URL`       | API base URL                                               |
| dashboard | `REACT_APP_SITE_URL`      | Website URL for "Go to the Vittora website" links          |
| frontend  | `REACT_APP_DASHBOARD_URL` | Dashboard URL used by Sign up and dashboard links          |
| frontend  | `REACT_APP_API_URL`       | API URL for the status check on the Products page          |

Each app falls back to the live URLs above if a variable isn't set.

## API reference

| Method | Path              | Body                                    | Returns                                  |
| ------ | ----------------- | --------------------------------------- | ---------------------------------------- |
| GET    | `/`, `/health`    |                                         | `{ ok, service, storage }`               |
| GET    | `/quotes`         |                                         | `{ asOf, indices[], instruments[] }`     |
| GET    | `/allHoldings`    |                                         | Holdings with price, P&L, net, day       |
| GET    | `/allPositions`   |                                         | Open intraday positions                  |
| GET    | `/allOrders`      |                                         | Orders, newest first                     |
| GET    | `/funds`          |                                         | Cash, opening balance, pay-in/out, etc.  |
| POST   | `/newOrder`       | `{ name, qty, price, mode, product }`   | `201 { message, order, funds }`          |
| POST   | `/funds/add`      | `{ amount }`                            | `{ message, funds }`                     |
| POST   | `/funds/withdraw` | `{ amount }`                            | `{ message, funds }`                     |

`mode` is `BUY` or `SELL`; `product` is `CNC` (delivery, default) or `MIS` (intraday). Rejected requests
return `400 { error, field }` with a sentence the dashboard shows as is.

Example:

```bash
curl -X POST http://localhost:3002/newOrder \
  -H "Content-Type: application/json" \
  -d '{"name":"INFY","qty":2,"price":1555,"mode":"BUY","product":"CNC"}'
```

## Tests

```bash
npm test                                            # all 58 tests
cd backend && npm test                              # 36 API tests
cd frontend && npm test -- --watchAll=false         # 9 website tests
cd dashboard && npm test -- --watchAll=false        # 13 dashboard tests
```

## Deployment

- **Website**: Netlify site with base directory `frontend` (see `netlify.toml`). Set
  `REACT_APP_DASHBOARD_URL` and `REACT_APP_API_URL`.
- **Dashboard**: Netlify site with base directory `dashboard` (see `dashboard/netlify.toml`). Set
  `REACT_APP_API_URL` and `REACT_APP_SITE_URL`.
- **API**: Render web service with root directory `backend`, build `npm install`, start `npm start`,
  health check `/health`. Set `MONGO_URL` to your MongoDB Atlas connection string.

Pushing to `main` redeploys all three if the sites are connected to this repository.

## Limitations and next steps

- One shared demo account: everyone who opens the dashboard sees the same portfolio. Adding sign-in
  (for example JWT with hashed passwords) would give each person their own account.
- Prices are simulated, not live market data.
- Only brokerage is simulated; taxes such as STT, GST and stamp duty are not.
- No way to reset the shared portfolio from the dashboard yet.

## Author

**Priyanshu Jaiswal**, https://github.com/priyanshu25jais

# Vittora: practise trading Indian stocks

Vittora is a practice stock trading platform. Watch NSE and BSE stock prices move, buy and sell with
₹1,00,000 of demo money, and track your holdings, orders and profit or loss, with nothing at risk.

> Vittora is a student project, not a real stock broker. It isn't registered with SEBI, prices are sample
> data, and no real money or shares are involved.

## Try it

- **Website:** https://stock-tradingplatform.netlify.app
- **Dashboard:** https://stock-tradingdashboard.netlify.app

The first visit can take up to a minute to load while the free server wakes up.

## What you can do

- Watch 17 Indian stocks plus NIFTY 50 and SENSEX, with prices that update every few seconds
- Search stocks by symbol or company name
- Buy and sell as **Delivery** (keep the shares) or **Intraday** (close the same day)
- See the order value and brokerage before you confirm
- Track holdings with average cost, current value and profit or loss
- See every order you've placed, newest first
- Add or withdraw demo money
- Use it on your phone

## How to use it

1. Open the website and press **Sign up**. Enter the name you'd like to see on the dashboard.
2. On the dashboard, hover over a stock in the watchlist and press **B** to buy (on a phone, open
   **Watchlist** and tap **B**).
3. Choose Delivery or Intraday, enter a quantity, and press **Buy**.
4. Find your shares under **Holdings** (Delivery) or **Positions** (Intraday).
5. To sell, press **S** in the watchlist or **Sell** on the stock's row.

**Charges:** Delivery orders are free. Intraday orders cost ₹20 or 0.03% of the order value, whichever
is lower.

**Good to know:** everyone shares one demo account, so you may see other people's trades.

## Run it on your computer

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
git clone https://github.com/priyanshu25jais/stock-trading-platform.git
cd stock-trading-platform
npm run setup
npm run dev
```

Then open http://localhost:3000. To save data in your own MongoDB database, create `backend/.env`
containing `MONGO_URL=<your connection string>`; without it, the demo data resets each time you stop it.

## Built with

React, Node.js, Express and MongoDB. Hosted on Netlify and Render.

## Made by

**Priyanshu Jaiswal**, https://github.com/priyanshu25jais

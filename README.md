# Zerodha Clone - Full Stack Stock Trading Platform

A full-stack stock trading platform inspired by Zerodha, built using React, Node.js, Express, and MongoDB. The project consists of a marketing website, a trading dashboard, and a backend API that serves holdings, positions, and order data.

## Live Demo

### Landing Website

https://stock-tradingplatform.netlify.app

### Trading Dashboard

https://stock-tradingdashboard.netlify.app

### Backend API

https://stock-trading-platform-wezz.onrender.com

---

## Project Overview

This project recreates the core experience of a modern stock trading platform. It includes:

* Landing pages similar to Zerodha's public website
* Interactive trading dashboard
* Holdings and positions management
* Orders section
* Funds overview
* REST API integration
* MongoDB database connectivity
* Cloud deployment using Netlify and Render

---

## Tech Stack

### Frontend

* React.js
* React Router
* Bootstrap
* Axios

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas

### Deployment

* Netlify (Frontend & Dashboard)
* Render (Backend API)

---

## Project Structure

```text
stock-trading-platform/
│
├── frontend/      # Landing website
├── dashboard/     # Trading dashboard
├── backend/       # Express API server
│
└── README.md
```

---

## Features

### Landing Website

* Home page
* About page
* Product page
* Pricing page
* Support page
* Signup redirection

### Trading Dashboard

* Dashboard overview
* Holdings data
* Orders section
* Positions section
* Funds management
* Live API integration

### Backend API

* Holdings endpoint
* Positions endpoint
* Orders endpoint
* MongoDB integration
* CORS enabled

---

## Local Setup

### Clone Repository

```bash
git clone https://github.com/priyanshu25jais/stock-trading-platform.git
cd stock-trading-platform
```

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm start
```

### Dashboard

```bash
cd dashboard
npm install
npm start
```

---

## Environment Variables

Dashboard:

```env
REACT_APP_API_URL=http://localhost:3002
```

Production:

```env
REACT_APP_API_URL=https://stock-trading-platform-wezz.onrender.com
```

Backend:

```env
MONGO_URL=your_mongodb_connection_string
```

---

## Deployment

### Frontend

Hosted on Netlify

### Dashboard

Hosted on Netlify

### Backend

Hosted on Render

---

## Future Improvements

* User authentication
* JWT-based login system
* Real-time stock prices
* Portfolio analytics
* Trade execution simulation
* Responsive mobile dashboard

---

## Author

**Priyanshu Jaiswal**

GitHub:
https://github.com/priyanshu25jais


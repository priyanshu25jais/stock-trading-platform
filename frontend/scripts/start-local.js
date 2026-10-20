// Starts the website for local development: port 3000, linking to the dashboard and
// API on your own computer instead of the live ones. Used by `npm run dev` in the project folder.
// (Plain `npm start` still links to the live sites.)
process.env.PORT = process.env.PORT || "3000";
process.env.REACT_APP_DASHBOARD_URL = process.env.REACT_APP_DASHBOARD_URL || "http://localhost:3001";
process.env.REACT_APP_API_URL = process.env.REACT_APP_API_URL || "http://localhost:3002";

require("react-scripts/scripts/start");

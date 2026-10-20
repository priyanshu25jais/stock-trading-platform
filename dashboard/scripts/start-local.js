// Starts the dashboard for local development: port 3001, talking to the API on
// your own computer instead of the live one. Used by `npm run dev` in the project folder.
// (Plain `npm start` still uses the live API.)
process.env.PORT = process.env.PORT || "3001";
process.env.BROWSER = process.env.BROWSER || "none";
process.env.REACT_APP_API_URL = process.env.REACT_APP_API_URL || "http://localhost:3002";
process.env.REACT_APP_SITE_URL = process.env.REACT_APP_SITE_URL || "http://localhost:3000";

require("react-scripts/scripts/start");

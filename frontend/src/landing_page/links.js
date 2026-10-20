const trim = (url) => url.replace(/\/$/, "");

export const DASHBOARD_URL = trim(
  process.env.REACT_APP_DASHBOARD_URL || "https://stock-tradingdashboard.netlify.app",
);
export const API_URL = trim(
  process.env.REACT_APP_API_URL || "https://stock-trading-platform-wezz.onrender.com",
);
export const REPO_URL = "https://github.com/priyanshu25jais/stock-trading-platform";
export const AUTHOR_URL = "https://github.com/priyanshu25jais";

export function dashboardLink(name) {
  const clean = String(name || "").trim();
  return clean ? `${DASHBOARD_URL}/?name=${encodeURIComponent(clean)}` : `${DASHBOARD_URL}/`;
}

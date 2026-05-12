const raw = process.env.REACT_APP_API_URL || "https://stock-trading-platform-wezz.onrender.com";
export const API_BASE = raw.replace(/\/$/, "");

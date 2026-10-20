// Shared Chart.js styling so charts match the dashboard.
export const COLORS = {
  ink: "#1E2060",
  indigo: "#3A3FB5",
  gain: "#0A7A52",
  loss: "#C8372C",
  text: "#1B1C2E",
  muted: "#5D6178",
  grid: "#E3E5EF",
};

export const FONT = { family: "'IBM Plex Sans', system-ui, sans-serif", size: 12 };

export const tooltip = {
  backgroundColor: "#1B1C2E",
  titleFont: { ...FONT, weight: "600" },
  bodyFont: FONT,
  padding: 10,
  cornerRadius: 6,
  displayColors: false,
};

// Axis tick label for rupee values, with a real minus sign: −₹100
export const rupeeTick = (v) => `${v < 0 ? "−" : ""}₹${Math.abs(Number(v)).toLocaleString("en-IN")}`;

const money = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const inr = (n) => money.format(Number(n) || 0);
export const rupees = (n) => `₹${inr(n)}`;

// Short form used in summary figures: 3,74,250 -> 3.74L, 29,875 -> 29.88k
export function compact(n) {
  const v = Number(n) || 0;
  const abs = Math.abs(v);
  if (abs >= 1e7) return `${(v / 1e7).toFixed(2)}Cr`;
  if (abs >= 1e5) return `${(v / 1e5).toFixed(2)}L`;
  if (abs >= 1e3) return `${(v / 1e3).toFixed(2)}k`;
  return v.toFixed(2);
}

export const signed = (n, digits = 2) => `${n >= 0 ? "+" : "−"}${Math.abs(n).toFixed(digits)}`;
export const signedPct = (n) => `${signed(n)}%`;
export const tone = (n) => (n > 0 ? "gain" : n < 0 ? "loss" : "flat");

export function time(value) {
  if (!value) return "";
  const d = new Date(value);
  const today = new Date();
  const sameDay = d.toDateString() === today.toDateString();
  const opts = sameDay
    ? { hour: "2-digit", minute: "2-digit" }
    : { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" };
  return d.toLocaleString("en-IN", opts);
}

import React from "react";

// Vittora mark: a price line that forms a "V" and keeps rising.
export function Mark({ size = 28, onDark = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="8" fill={onDark ? "rgba(255,255,255,0.12)" : "#1E2060"} />
      <path
        d="M8 10 L14.5 22 L19 15 L24 9"
        stroke="#FFFFFF"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="9" r="2.6" fill="#F4A300" />
    </svg>
  );
}

export default function Logo({ onDark = false, label = "vittora" }) {
  return (
    <span className={`logo ${onDark ? "logo-on-dark" : ""}`}>
      <Mark onDark={onDark} />
      <span className="logo-word">{label}</span>
    </span>
  );
}

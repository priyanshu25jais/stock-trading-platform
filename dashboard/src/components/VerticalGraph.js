import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";

import { COLORS, FONT, rupeeTick, tooltip } from "./chartTheme";
import { rupees } from "../format";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

// P&L per holding: bars rise above zero for gains and drop below for losses.
export function VerticalGraph({ rows }) {
  const sorted = [...rows].sort((a, b) => b.pnl - a.pnl);
  const data = {
    labels: sorted.map((r) => r.name),
    datasets: [
      {
        label: "P&L",
        data: sorted.map((r) => Number(r.pnl.toFixed(2))),
        backgroundColor: sorted.map((r) => (r.pnl >= 0 ? COLORS.gain : COLORS.loss)),
        borderRadius: 4,
        borderSkipped: false,
        maxBarThickness: 28,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        ...tooltip,
        callbacks: {
          label: (ctx) => `P&L ${ctx.raw >= 0 ? "+" : "−"}${rupees(Math.abs(ctx.raw))}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: COLORS.muted, font: FONT, autoSkip: false, maxRotation: 45 },
      },
      y: {
        grid: { color: COLORS.grid },
        border: { display: false },
        ticks: { color: COLORS.muted, font: FONT, callback: rupeeTick },
      },
    },
  };

  return (
    <div className="chart chart-tall">
      <Bar
        data={data}
        options={options}
        aria-label="Bar chart of profit or loss for each holding"
        role="img"
      />
    </div>
  );
}

export default VerticalGraph;

import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";

import { COLORS, FONT, rupeeTick, tooltip } from "./chartTheme";
import { rupees } from "../format";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

// Where the money is: current value of each holding, largest first.
// A bar reads more accurately than a doughnut once there are more than a
// handful of holdings; anything past `limit` is folded into "Other".
export function AllocationChart({ rows, limit = 8 }) {
  const sorted = [...rows].sort((a, b) => b.curValue - a.curValue);
  const top = sorted.slice(0, limit);
  const rest = sorted.slice(limit);
  if (rest.length) {
    top.push({ name: `Other ${rest.length}`, curValue: rest.reduce((t, r) => t + r.curValue, 0) });
  }
  const total = sorted.reduce((t, r) => t + r.curValue, 0) || 1;

  const data = {
    labels: top.map((r) => r.name),
    datasets: [
      {
        label: "Current value",
        data: top.map((r) => Number(r.curValue.toFixed(2))),
        backgroundColor: COLORS.indigo,
        borderRadius: 4,
        borderSkipped: false,
        maxBarThickness: 16,
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        ...tooltip,
        callbacks: {
          label: (ctx) => `${rupees(ctx.raw)} (${((ctx.raw / total) * 100).toFixed(1)}% of holdings)`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: COLORS.grid },
        border: { display: false },
        ticks: { color: COLORS.muted, font: FONT, callback: rupeeTick, maxTicksLimit: 5, maxRotation: 0 },
      },
      y: { grid: { display: false }, ticks: { color: COLORS.text, font: FONT } },
    },
  };

  return (
    <div className="chart" style={{ height: `${Math.max(180, top.length * 30 + 40)}px` }}>
      <Bar data={data} options={options} aria-label="Bar chart of current value by holding" role="img" />
    </div>
  );
}

export default AllocationChart;

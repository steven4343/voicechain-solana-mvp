import { useEffect, useRef } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

interface RiskChartProps {
  data: { timestamp: number; score: number }[];
}

export function RiskScoreChart({ data }: RiskChartProps) {
  const labels = data.map((d) => new Date(d.timestamp).toLocaleDateString());
  const scores = data.map((d) => d.score);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Risk Score",
        data: scores,
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: scores.map((s) => (s >= 75 ? "#ef4444" : s >= 40 ? "#eab308" : "#10b981")),
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#fff",
        bodyColor: "#cbd5e1",
        borderColor: "#334155",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(51, 65, 85, 0.5)" },
        ticks: { color: "#94a3b8" },
      },
      y: {
        min: 0,
        max: 100,
        grid: { color: "rgba(51, 65, 85, 0.5)" },
        ticks: { color: "#94a3b8" },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}

interface TransactionChartProps {
  data: { date: string; count: number }[];
}

export function TransactionVolumeChart({ data }: TransactionChartProps) {
  const chartData = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        label: "Transactions",
        data: data.map((d) => d.count),
        backgroundColor: "rgba(6, 182, 212, 0.6)",
        borderColor: "#06b6d4",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { color: "rgba(51, 65, 85, 0.5)" },
        ticks: { color: "#94a3b8" },
      },
      y: {
        grid: { color: "rgba(51, 65, 85, 0.5)" },
        ticks: { color: "#94a3b8" },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}

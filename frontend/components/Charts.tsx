import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface RiskChartProps {
  data: { timestamp: number; score: number }[];
}

export function RiskScoreChart({ data }: RiskChartProps) {
  const chartData = data.map((d) => ({ date: new Date(d.timestamp).toLocaleDateString(), score: d.score }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="date" stroke="var(--muted-foreground)" tick={{ fontSize: 12 }} />
        <YAxis domain={[0, 100]} stroke="var(--muted-foreground)" tick={{ fontSize: 12 }} />
        <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} labelStyle={{ color: "var(--foreground)" }} />
        <Line type="monotone" dataKey="score" stroke="var(--neon-cyan)" strokeWidth={2} dot={{ fill: "var(--neon-cyan)" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

interface TransactionChartProps {
  data: { date: string; count: number }[];
}

export function TransactionVolumeChart({ data }: TransactionChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="date" stroke="var(--muted-foreground)" tick={{ fontSize: 12 }} />
        <YAxis stroke="var(--muted-foreground)" tick={{ fontSize: 12 }} />
        <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} labelStyle={{ color: "var(--foreground)" }} />
        <Bar dataKey="count" fill="var(--neon-cyan)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

import { useState } from "react";
import { TrendingUp, Activity, Shield, AlertTriangle } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from "recharts";

const riskScoreHistory = [
  { date: "Week 1", score: 88 }, { date: "Week 2", score: 92 }, { date: "Week 3", score: 85 },
  { date: "Week 4", score: 90 }, { date: "Week 5", score: 95 }, { date: "Week 6", score: 91 },
  { date: "Week 7", score: 93 }, { date: "Week 8", score: 94 },
];

const transactionCategories = [
  { name: "DeFi Protocols", value: 35, color: "var(--neon-purple)" },
  { name: "NFT Marketplaces", value: 25, color: "var(--neon-blue)" },
  { name: "Peer-to-Peer", value: 20, color: "var(--neon-cyan)" },
  { name: "Exchanges", value: 15, color: "var(--neon-violet)" },
  { name: "Other", value: 5, color: "var(--neon-indigo)" },
];

const walletActivityTrends = [
  { month: "Jan", transactions: 45, volume: 120 }, { month: "Feb", transactions: 52, volume: 145 },
  { month: "Mar", transactions: 48, volume: 130 }, { month: "Apr", transactions: 65, volume: 180 },
  { month: "May", transactions: 70, volume: 195 }, { month: "Jun", transactions: 68, volume: 175 },
];

const securityWarnings = [
  { month: "Jan", critical: 2, medium: 5, low: 8 }, { month: "Feb", critical: 1, medium: 4, low: 6 },
  { month: "Mar", critical: 3, medium: 7, low: 10 }, { month: "Apr", critical: 0, medium: 3, low: 5 },
  { month: "May", critical: 1, medium: 2, low: 4 }, { month: "Jun", critical: 0, medium: 1, low: 3 },
];

const topRiskyAddresses = [
  { address: "9fB2...xT8n", riskScore: 85, interactions: 12 },
  { address: "3kL9...mP2q", riskScore: 72, interactions: 8 },
  { address: "7hN4...vQ8r", riskScore: 68, interactions: 15 },
  { address: "2mP9...kR4m", riskScore: 55, interactions: 6 },
  { address: "5wQ1...xT8n", riskScore: 48, interactions: 10 },
];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("30d");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights into your wallet security and transaction patterns</p>
        </div>
        <div className="flex items-center gap-2">
          {["7d", "30d", "90d"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                timeRange === range
                  ? "bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] text-white"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: TrendingUp, label: "Avg Risk Score", value: "91.5", trend: "+8.2%", color: "neon-purple", border: "neon-purple" },
          { icon: Activity, label: "Total Transactions", value: "348", trend: "+12.5%", color: "neon-cyan", border: "neon-cyan" },
          { icon: Shield, label: "Threats Blocked", value: "18", trend: "+15.3%", color: "success", border: "success" },
          { icon: AlertTriangle, label: "Warnings Triggered", value: "12", trend: "-45.2%", color: "warning", border: "warning" },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className={`p-6 rounded-xl bg-card border border-border hover:border-[var(--${s.border})]/50 transition-all`}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--${s.color})]/20 to-[var(--neon-blue)]/20 flex items-center justify-center">
                  <Icon className={`w-5 h-5 text-[var(--${s.color})]`} />
                </div>
                <span className={`text-xs ${s.trend.startsWith("+") ? "text-[var(--success)]" : "text-[var(--destructive)]"} flex items-center gap-1`}>
                  <TrendingUp className="w-3 h-3" />{s.trend}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{s.label}</p>
              <h3 className="text-2xl">{s.value}</h3>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="mb-1">Risk Score History</h3>
              <p className="text-sm text-muted-foreground">Your security score trend over time</p>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-[var(--success)]/10 text-[var(--success)] text-sm">Improving</div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={riskScoreHistory}>
              <defs>
                <linearGradient id="colorRiskScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--neon-purple)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--neon-purple)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
              <Area type="monotone" dataKey="score" stroke="var(--neon-purple)" strokeWidth={3} fillOpacity={1} fill="url(#colorRiskScore)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 rounded-xl bg-card border border-border">
          <h3 className="mb-6">Transaction Categories</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={transactionCategories} cx="50%" cy="50%" labelLine={false} outerRadius={80} dataKey="value">
                {transactionCategories.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {transactionCategories.map((c, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }}></div>
                  <span className="text-muted-foreground">{c.name}</span>
                </div>
                <span>{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-card border border-border">
          <h3 className="mb-6">Wallet Activity Trends</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={walletActivityTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
              <Legend />
              <Bar dataKey="transactions" fill="var(--neon-cyan)" name="Transactions" radius={[8, 8, 0, 0]} />
              <Bar dataKey="volume" fill="var(--neon-purple)" name="Volume (SOL)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 rounded-xl bg-card border border-border">
          <h3 className="mb-6">Security Warnings Over Time</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={securityWarnings}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
              <Legend />
              <Line type="monotone" dataKey="critical" stroke="var(--destructive)" strokeWidth={2} name="Critical" />
              <Line type="monotone" dataKey="medium" stroke="var(--warning)" strokeWidth={2} name="Medium" />
              <Line type="monotone" dataKey="low" stroke="var(--success)" strokeWidth={2} name="Low" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-card border border-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="mb-1">Top Risky Addresses Interacted</h3>
            <p className="text-sm text-muted-foreground">Wallet addresses with the highest risk scores you've transacted with</p>
          </div>
        </div>
        <div className="space-y-3">
          {topRiskyAddresses.map((addr, i) => (
            <div key={i} className="p-4 rounded-lg bg-secondary/50 border border-border hover:border-[var(--warning)]/30 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-[var(--warning)]/20 to-[var(--destructive)]/20 text-sm">{i + 1}</div>
                  <div>
                    <p className="mb-1">{addr.address}</p>
                    <p className="text-sm text-muted-foreground">{addr.interactions} interactions</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-muted-foreground">Risk Score:</span>
                    <span className={`px-3 py-1 rounded-full text-sm ${addr.riskScore >= 70 ? "bg-[var(--destructive)]/10 text-[var(--destructive)]" : addr.riskScore >= 50 ? "bg-[var(--warning)]/10 text-[var(--warning)]" : "bg-[var(--success)]/10 text-[var(--success)]"}`}>
                      {addr.riskScore}/100
                    </span>
                  </div>
                  <div className="w-32 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${addr.riskScore >= 70 ? "bg-[var(--destructive)]" : addr.riskScore >= 50 ? "bg-[var(--warning)]" : "bg-[var(--success)]"}`} style={{ width: `${addr.riskScore}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

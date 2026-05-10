import { Wallet, TrendingUp, Shield, AlertTriangle, Activity, ArrowUpRight, ArrowDownLeft, CheckCircle2 } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAppContext } from "../context/AppContext";
import Link from "next/link";

const riskData = [
  { date: "Mon", score: 25 }, { date: "Tue", score: 18 }, { date: "Wed", score: 85 },
  { date: "Thu", score: 12 }, { date: "Fri", score: 91 }, { date: "Sat", score: 15 }, { date: "Sun", score: 28 },
];

const alerts = [
  { type: "warning", message: "New wallet interaction flagged - review recommended", time: "2 min ago" },
  { type: "info", message: "Transaction pattern analysis completed", time: "1 hour ago" },
  { type: "success", message: "VoiceChain AI engine running optimally", time: "1 day ago" },
];

export default function Dashboard() {
  const { publicKey, connected } = useWallet();
  const { stats, transactions } = useAppContext();

  const recentTransactions = [
    { id: 1, type: "receive" as const, from: "8xK2...mP9q", amount: "2.5 SOL", risk: "low" as const, timestamp: "2 hours ago", status: "confirmed" },
    { id: 2, type: "send" as const, to: "vN3p...7wQ1", amount: "0.8 SOL", risk: "low" as const, timestamp: "5 hours ago", status: "confirmed" },
    ...transactions.slice(0, 3).map((tx, i) => ({
      id: 100 + i,
      type: "send" as const,
      to: tx.to,
      amount: tx.amount,
      risk: tx.riskLevel,
      timestamp: tx.timestamp < Date.now() - 60000 ? `${Math.floor((Date.now() - tx.timestamp) / 60000)} min ago` : "Just now",
      status: tx.status,
    })),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Security Dashboard</h1>
        <p className="text-muted-foreground">
          {connected
            ? `Wallet: ${publicKey?.toBase58().slice(0, 8)}...${publicKey?.toBase58().slice(-4)}`
            : "Demo mode - explore all features"}
        </p>
      </div>

      {!connected && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-[var(--neon-purple)]/10 to-[var(--neon-blue)]/10 border border-[var(--neon-purple)]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wallet className="w-5 h-5 text-[var(--neon-purple)]" />
              <div>
                <p className="text-sm">Connect your wallet for full transaction monitoring</p>
                <p className="text-xs text-muted-foreground">Phantom and Solflare supported</p>
              </div>
            </div>
            <Link href="/transactions" className="px-4 py-2 rounded-lg bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] text-white text-sm hover:shadow-lg transition-all">
              Try Demo
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Wallet, label: connected ? "Wallet Balance" : "Demo Balance", value: "45.87 SOL", sub: "~$4,587.32 USD", color: "neon-purple", trend: "+2.5%" },
          { icon: Shield, label: "Risk Score", value: `${Math.max(0, 100 - (transactions.find(t => t.riskLevel === "high")?.riskScore || 0))}/100`, sub: "Good", color: "success", trend: "+3" },
          { icon: Activity, label: "Transactions", value: String(stats.totalScanned), sub: "Scanned", color: "neon-cyan", trend: `+${transactions.length}` },
          { icon: AlertTriangle, label: "Pending Review", value: String(stats.pendingReview), sub: stats.pendingReview > 0 ? "Requires action" : "All clear", color: stats.pendingReview > 0 ? "warning" : "success", trend: stats.pendingReview > 0 ? "Action needed" : "Good" },
        ].map((card, i) => (
          <div key={i} className="p-6 rounded-xl bg-card border border-border hover:border-[var(--neon-purple)]/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--${card.color})]/20 to-[var(--neon-blue)]/20 flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 text-[var(--${card.color})]`} />
              </div>
              <span className="text-xs text-[var(--success)] flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />{card.trend}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{card.label}</p>
            <h3 className="text-2xl">{card.value}</h3>
            <p className="text-xs text-muted-foreground mt-2">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="mb-1">Risk Score History</h3>
              <p className="text-sm text-muted-foreground">Transaction risk assessment over time</p>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-[var(--success)]/10 text-[var(--success)] text-sm">Monitoring</div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={riskData}>
                <defs>
                  <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--neon-cyan)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--neon-cyan)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" stroke="var(--muted-foreground)" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} stroke="var(--muted-foreground)" tick={{ fontSize: 12 }} label={{ value: "Risk Score", angle: -90, position: "insideLeft", style: { fill: 'var(--muted-foreground)', fontSize: 12 } }} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} labelStyle={{ color: "var(--foreground)" }} />
                <Area type="monotone" dataKey="score" stroke="var(--neon-cyan)" fill="url(#riskGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-card border border-border">
          <h3 className="mb-4">Security Alerts</h3>
          <div className="space-y-3">
            {alerts.map((a, i) => (
              <div key={i} className={`p-3 rounded-lg bg-secondary/50 border border-border border-l-4 ${
                a.type === "warning" ? "border-l-[var(--warning)]" : a.type === "info" ? "border-l-[var(--neon-blue)]" : "border-l-[var(--success)]"
              }`}>
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                    a.type === "warning" ? "text-[var(--warning)]" : a.type === "info" ? "text-[var(--neon-blue)]" : "text-[var(--success)]"
                  }`} />
                  <div>
                    <p className="text-sm">{a.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{a.time}</p>
                  </div>
                </div>
              </div>
            ))}
            {stats.pendingReview > 0 && (
              <div className="p-3 rounded-lg bg-secondary/50 border border-border border-l-4 border-l-[var(--warning)]">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 mt-0.5 text-[var(--warning)]" />
                  <div>
                    <p className="text-sm font-medium">{stats.pendingReview} transaction(s) pending review</p>
                    <Link href="/transactions" className="text-xs text-[var(--neon-purple)] hover:underline mt-1 inline-block">
                      Review now →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-card border border-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="mb-1">Recent Activity</h3>
            <p className="text-sm text-muted-foreground">Latest transaction reviews</p>
          </div>
          <Link href="/transactions" className="text-xs text-[var(--neon-purple)] hover:underline">
            View all →
          </Link>
        </div>
        <div className="space-y-3">
          {transactions.length > 0 ? (
            transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border hover:border-[var(--neon-purple)]/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    tx.status === "approved" ? "bg-[var(--success)]/10" :
                    tx.status === "rejected" ? "bg-destructive/10" :
                    "bg-[var(--warning)]/10"
                  }`}>
                    {tx.status === "approved" ? <CheckCircle2 className="w-5 h-5 text-[var(--success)]" /> :
                     tx.status === "rejected" ? <ArrowUpRight className="w-5 h-5 text-destructive" /> :
                     <Activity className="w-5 h-5 text-[var(--warning)]" />}
                  </div>
                  <div>
                    <p className="text-sm">To {tx.to}</p>
                    <p className="text-xs text-muted-foreground">Risk: {tx.riskLevel} ({tx.riskScore}/100)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{tx.amount}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    tx.status === "approved" ? "bg-[var(--success)]/10 text-[var(--success)]" :
                    tx.status === "rejected" ? "bg-destructive/10 text-destructive" :
                    "bg-[var(--warning)]/10 text-[var(--warning)]"
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>No transactions reviewed yet</p>
              <Link href="/transactions" className="text-[var(--neon-purple)] hover:underline text-sm">
                Try the transaction simulator →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

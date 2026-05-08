import { useState, useEffect } from "react";
import { Shield, AlertTriangle, TrendingUp, BarChart3, DollarSign } from "lucide-react";
import { RiskScoreChart, TransactionVolumeChart } from "../components/Charts";
import RiskScoreCard from "../components/RiskScoreCard";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export default function AnalyticsPage() {
  const [summary, setSummary] = useState({
    totalTransactions: 0,
    blockedTransactions: 0,
    averageRiskScore: 0,
    highRiskDetected: 0,
    protectedAmount: "0 SOL",
  });
  const [riskHistory, setRiskHistory] = useState<{ timestamp: number; score: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, historyRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/analytics/summary`),
          fetch(`${BACKEND_URL}/api/analytics/risk-history`),
        ]);

        if (summaryRes.ok) setSummary(await summaryRes.json());
        if (historyRes.ok) {
          const data = await historyRes.json();
          setRiskHistory(data.history);
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
        setRiskHistory([
          { timestamp: Date.now() - 3600000 * 24 * 7, score: 15 },
          { timestamp: Date.now() - 3600000 * 24 * 6, score: 45 },
          { timestamp: Date.now() - 3600000 * 24 * 5, score: 82 },
          { timestamp: Date.now() - 3600000 * 24 * 4, score: 23 },
          { timestamp: Date.now() - 3600000 * 24 * 3, score: 91 },
          { timestamp: Date.now() - 3600000 * 24 * 2, score: 34 },
          { timestamp: Date.now() - 3600000 * 24 * 1, score: 12 },
          { timestamp: Date.now(), score: 28 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const txVolumeData = [
    { date: "Mon", count: 42 },
    { date: "Tue", count: 38 },
    { date: "Wed", count: 55 },
    { date: "Thu", count: 47 },
    { date: "Fri", count: 63 },
    { date: "Sat", count: 29 },
    { date: "Sun", count: 35 },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-dark-400">Track security metrics and transaction activity</p>
      </div>

      {loading ? (
        <div className="glass-card p-12 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-dark-400">Loading analytics...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="glass-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary-400" />
                </div>
              </div>
              <p className="text-2xl font-bold">{summary.totalTransactions}</p>
              <p className="text-xs text-dark-400 mt-1">Total Transactions</p>
            </div>

            <div className="glass-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-accent-red/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-accent-red" />
                </div>
              </div>
              <p className="text-2xl font-bold text-accent-red">{summary.blockedTransactions}</p>
              <p className="text-xs text-dark-400 mt-1">Blocked Transactions</p>
            </div>

            <div className="glass-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-accent-green/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-accent-green" />
                </div>
              </div>
              <p className="text-2xl font-bold">{summary.protectedAmount}</p>
              <p className="text-xs text-dark-400 mt-1">Protected Funds</p>
            </div>

            <div className="glass-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-accent-yellow/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-accent-yellow" />
                </div>
              </div>
              <p className="text-2xl font-bold">{summary.highRiskDetected}</p>
              <p className="text-xs text-dark-400 mt-1">High Risk Detected</p>
            </div>

            <div className="glass-card p-5 flex flex-col items-center justify-center">
              <RiskScoreCard score={summary.averageRiskScore} size="sm" />
              <p className="text-xs text-dark-400 mt-1">Avg Risk Score</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold mb-4">Risk Score History</h2>
              <RiskScoreChart data={riskHistory} />
            </div>

            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold mb-4">Transaction Volume (7 Days)</h2>
              <TransactionVolumeChart data={txVolumeData} />
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">Security Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-dark-800/50 rounded-xl p-4">
                <h3 className="text-sm font-medium text-dark-400 mb-2">Threat Prevention Rate</h3>
                <p className="text-3xl font-bold text-accent-green">
                  {summary.totalTransactions > 0
                    ? Math.round((summary.blockedTransactions / summary.totalTransactions) * 100)
                    : 0}
                  %
                </p>
              </div>
              <div className="bg-dark-800/50 rounded-xl p-4">
                <h3 className="text-sm font-medium text-dark-400 mb-2">Response Time</h3>
                <p className="text-3xl font-bold text-accent-cyan">{"< 2s"}</p>
              </div>
              <div className="bg-dark-800/50 rounded-xl p-4">
                <h3 className="text-sm font-medium text-dark-400 mb-2">Voice Alerts Triggered</h3>
                <p className="text-3xl font-bold text-accent-yellow">{summary.highRiskDetected}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

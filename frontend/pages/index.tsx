import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Shield, AlertTriangle, TrendingUp, Wallet, ArrowUpRight, Volume2, VolumeX } from "lucide-react";
import RiskScoreCard from "../components/RiskScoreCard";
import TransactionCard from "../components/TransactionCard";
import VoiceAlertBanner from "../components/VoiceAlertBanner";
import { useAppContext } from "../context/AppContext";
import { useVoiceAlert } from "../hooks/useVoiceAlert";
import { RiskAnalysis } from "../types";

const MOCK_TRANSACTIONS = [
  { signature: "5xKp...9mQ2", timestamp: Date.now() - 3600000, amount: 2.5e9, destination: "7xKX...p3Qm", status: "confirmed" as const, riskScore: 15 },
  { signature: "8nRt...3kL7", timestamp: Date.now() - 7200000, amount: -0.8e9, destination: "9mKw...x8Rt", status: "confirmed" as const, riskScore: 82 },
  { signature: "2vBn...6pW1", timestamp: Date.now() - 10800000, amount: 5.0e9, destination: "3cHj...5mYq", status: "confirmed" as const, riskScore: 23 },
  { signature: "4dFx...1rZ9", timestamp: Date.now() - 14400000, amount: -1.2e9, destination: "6tGk...2nVb", status: "failed" as const, riskScore: 91 },
  { signature: "7jMw...8sN4", timestamp: Date.now() - 18000000, amount: 0.5e9, destination: "8fPq...4kXc", status: "pending" as const, riskScore: 34 },
];

export default function Dashboard() {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState(12.45);
  const [showAlert, setShowAlert] = useState(false);
  const [activeAlert, setActiveAlert] = useState<RiskAnalysis | null>(null);
  const { voiceEnabled, toggleVoice } = useAppContext();
  const { speak, isSpeaking } = useVoiceAlert();

  const recentTransactions = MOCK_TRANSACTIONS;
  const blockedCount = recentTransactions.filter((t) => t.riskScore >= 75).length;

  const testHighRiskTransaction = async () => {
    const mockRisk: RiskAnalysis = {
      riskScore: 87,
      riskLevel: "high",
      reasons: [
        "Destination address flagged in phishing database",
        "Unusual token approval pattern detected",
        "Transaction mimics known scam structure",
      ],
      recommendation: "Do not proceed with this transaction",
      timestamp: Date.now(),
    };
    setActiveAlert(mockRisk);
    setShowAlert(true);
  };

  return (
    <div>
      {showAlert && activeAlert && (
        <VoiceAlertBanner
          riskScore={activeAlert.riskScore}
          reasons={activeAlert.reasons}
          recommendation={activeAlert.recommendation}
          onDismiss={() => setShowAlert(false)}
        />
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-dark-400">Monitor your wallet security and transaction activity</p>
      </div>

      {!connected && (
        <div className="glass-card p-12 text-center mb-8">
          <Shield className="w-16 h-16 text-primary-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
          <p className="text-dark-400 mb-6">Connect your Solana wallet to access security features</p>
        </div>
      )}

      {connected && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-primary-400" />
                </div>
                <span className="text-dark-400 text-sm">Balance</span>
              </div>
              <p className="text-2xl font-bold">{balance.toFixed(4)} SOL</p>
              <p className="text-xs text-dark-400 mt-1 font-mono">{publicKey?.toString().slice(0, 8)}...</p>
            </div>

            <div className="glass-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-accent-green/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-accent-green" />
                </div>
                <span className="text-dark-400 text-sm">Transactions</span>
              </div>
              <p className="text-2xl font-bold">{recentTransactions.length}</p>
              <p className="text-xs text-dark-400 mt-1">Last 24 hours</p>
            </div>

            <div className="glass-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-accent-red/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-accent-red" />
                </div>
                <span className="text-dark-400 text-sm">Blocked</span>
              </div>
              <p className="text-2xl font-bold text-accent-red">{blockedCount}</p>
              <p className="text-xs text-dark-400 mt-1">Risky transactions</p>
            </div>

            <div className="glass-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-accent-cyan/20 flex items-center justify-center">
                  {voiceEnabled ? (
                    <Volume2 className="w-5 h-5 text-accent-cyan" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-accent-cyan" />
                  )}
                </div>
                <span className="text-dark-400 text-sm">Voice Alerts</span>
              </div>
              <button onClick={toggleVoice} className={`text-sm font-semibold ${voiceEnabled ? "text-accent-green" : "text-dark-400"}`}>
                {voiceEnabled ? "Enabled" : "Disabled"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
                <div className="space-y-3">
                  {recentTransactions.map((tx) => (
                    <TransactionCard key={tx.signature} tx={tx} />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass-card p-6 flex flex-col items-center">
                <h2 className="text-lg font-semibold mb-4">Average Risk</h2>
                <RiskScoreCard score={34} size="lg" />
              </div>

              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold mb-4">Test Risk Analysis</h2>
                <p className="text-sm text-dark-400 mb-4">Simulate a risky transaction to test voice alerts</p>
                <button onClick={testHighRiskTransaction} className="btn-danger w-full flex items-center justify-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Simulate High Risk Tx
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

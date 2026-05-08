import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Search, AlertTriangle, Shield, CheckCircle, Loader2 } from "lucide-react";
import { useRiskAnalyzer } from "../hooks/useRiskAnalyzer";
import { RiskAnalysis } from "../types";

export default function AnalyzerPage() {
  const { publicKey } = useWallet();
  const { analyze, isAnalyzing, lastResult } = useRiskAnalyzer();
  const [txInput, setTxInput] = useState("");
  const [result, setResult] = useState<RiskAnalysis | null>(null);

  const handleAnalyze = async () => {
    if (!txInput.trim()) return;

    const mockTxData = {
      signature: txInput,
      destination: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      amount: 2.5e9,
      programId: "11111111111111111111111111111111",
      tokenTransfers: [],
      memo: "Test transaction for analysis",
    };

    const res = await analyze(mockTxData, publicKey?.toString());
    setResult(res);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Transaction Analyzer</h1>
        <p className="text-dark-400">Analyze any Solana transaction for security risks</p>
      </div>

      <div className="glass-card p-6 mb-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="text"
              placeholder="Enter transaction signature or paste transaction data..."
              value={txInput}
              onChange={(e) => setTxInput(e.target.value)}
              className="input-field w-full pl-12"
            />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !txInput.trim()}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Analyze
              </>
            )}
          </button>
        </div>
      </div>

      {result && (
        <div
          className={`glass-card p-6 border-2 ${
            result.riskScore >= 75
              ? "border-accent-red/50"
              : result.riskScore >= 40
              ? "border-accent-yellow/50"
              : "border-accent-green/50"
          }`}
        >
          <div className="flex items-start gap-4">
            {result.riskScore >= 75 ? (
              <AlertTriangle className="w-10 h-10 text-accent-red flex-shrink-0" />
            ) : result.riskScore >= 40 ? (
              <AlertTriangle className="w-10 h-10 text-accent-yellow flex-shrink-0" />
            ) : (
              <CheckCircle className="w-10 h-10 text-accent-green flex-shrink-0" />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold">
                  {result.riskScore >= 75 ? "High Risk Detected" : result.riskScore >= 40 ? "Medium Risk" : "Transaction Safe"}
                </h2>
                <span
                  className={`badge ${
                    result.riskScore >= 75 ? "badge-danger" : result.riskScore >= 40 ? "badge-warning" : "badge-success"
                  }`}
                >
                  Score: {result.riskScore}/100
                </span>
              </div>
              <p className="text-dark-300 mb-4">{result.recommendation}</p>
              <div className="space-y-2">
                {result.reasons.map((reason, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-dark-400 mt-1.5 flex-shrink-0" />
                    <span className="text-dark-200">{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="glass-card p-6 mt-6">
        <h2 className="text-lg font-semibold mb-4">Quick Test Transactions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => {
              setTxInput("safe_tx_001");
            }}
            className="bg-dark-800 hover:bg-dark-700 rounded-xl p-4 text-left transition-colors"
          >
            <p className="font-medium text-accent-green">Safe Transfer</p>
            <p className="text-xs text-dark-400">Normal SOL transfer</p>
          </button>
          <button
            onClick={() => {
              setTxInput("risky_tx_002");
            }}
            className="bg-dark-800 hover:bg-dark-700 rounded-xl p-4 text-left transition-colors"
          >
            <p className="font-medium text-accent-yellow">Suspicious Approval</p>
            <p className="text-xs text-dark-400">Unusual token approval</p>
          </button>
          <button
            onClick={() => {
              setTxInput("malicious_tx_003");
            }}
            className="bg-dark-800 hover:bg-dark-700 rounded-xl p-4 text-left transition-colors"
          >
            <p className="font-medium text-accent-red">Phishing Attempt</p>
            <p className="text-xs text-dark-400">Known scam address</p>
          </button>
        </div>
      </div>
    </div>
  );
}

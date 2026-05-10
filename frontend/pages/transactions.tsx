import { useState, useEffect } from "react";
import { Shield, AlertTriangle, CheckCircle2, XCircle, Activity, Clock, TrendingUp, Brain } from "lucide-react";
import { useAppContext, TxForReview } from "../context/AppContext";
import { useRiskAnalyzer } from "../hooks/useRiskAnalyzer";
import { useVoiceAlert } from "../hooks/useVoiceAlert";

function RiskMeter({ score }: { score: number }) {
  const getColor = () => { if (score >= 70) return "var(--destructive)"; if (score >= 40) return "var(--warning)"; return "var(--success)"; };
  const getLabel = () => { if (score >= 70) return "High Risk"; if (score >= 40) return "Medium Risk"; return "Low Risk"; };
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Risk Assessment</span>
        <span className="text-sm" style={{ color: getColor() }}>{getLabel()}</span>
      </div>
      <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--success)] via-[var(--warning)] to-[var(--destructive)]" style={{ clipPath: `inset(0 ${100 - score}% 0 0)` }}></div>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Safe</span>
        <span className="text-xl" style={{ color: getColor() }}>{score}/100</span>
        <span>Dangerous</span>
      </div>
    </div>
  );
}

function formatTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
  return `${Math.floor(diff / 86400000)} days ago`;
}

export default function Transactions() {
  const { transactions, updateTransactionStatus, stats, settings } = useAppContext();
  const { analyze, isAnalyzing } = useRiskAnalyzer();
  const { speak, isSpeaking } = useVoiceAlert();
  const [selected, setSelected] = useState<TxForReview | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (transactions.length > 0 && !selected) {
      const pending = transactions.find((t) => t.status === "pending");
      setSelected(pending || transactions[0]);
    }
  }, [transactions, selected]);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleApprove = async () => {
    if (!selected) return;
    setActionInProgress("approve");
    try {
      if (settings.voiceAuth && !isSpeaking) {
        await speak(`Approving transaction of ${selected.amount} to ${selected.to}`);
      }
      updateTransactionStatus(selected.id, "approved");
      showNotification("success", `Transaction approved: ${selected.amount}`);
    } catch (error) {
      showNotification("error", "Failed to approve transaction");
    } finally {
      setActionInProgress(null);
    }
  };

  const handleCancel = async () => {
    if (!selected) return;
    setActionInProgress("cancel");
    try {
      if (settings.voiceAuth && !isSpeaking) {
        await speak(`Cancelling transaction of ${selected.amount}`);
      }
      updateTransactionStatus(selected.id, "rejected");
      showNotification("success", "Transaction cancelled successfully");
    } catch (error) {
      showNotification("error", "Failed to cancel transaction");
    } finally {
      setActionInProgress(null);
    }
  };

  const handleAnalyze = async (tx: TxForReview) => {
    if (isAnalyzing) return;
    try {
      const result = await analyze(
        { to: tx.to, amount: tx.amountNum },
        "demo_wallet"
      );
      if (result.riskScore >= 70 && settings.securityWarnings) {
        speak(`Warning! High risk transaction detected. Risk score: ${result.riskScore}. ${result.recommendation}`);
      }
      showNotification("success", `Analysis complete - Risk: ${result.riskLevel}`);
    } catch (error) {
      showNotification("error", "Analysis failed, using local assessment");
    }
  };

  const pendingCount = transactions.filter((t) => t.status === "pending").length;
  const approvedCount = transactions.filter((t) => t.status === "approved").length;
  const rejectedCount = transactions.filter((t) => t.status === "rejected").length;

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-12">
        <Activity className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl mb-2">No Transactions Yet</h2>
        <p className="text-muted-foreground mb-6">When you initiate a transaction, it will appear here for risk review.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {notification && (
        <div className={`fixed top-20 right-6 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 ${
          notification.type === "success" ? "bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/30" : "bg-destructive/10 text-destructive border border-destructive/30"
        }`}>
          {notification.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          {notification.message}
        </div>
      )}

      <div>
        <h1 className="mb-2">Transaction Security</h1>
        <p className="text-muted-foreground">AI-powered scam detection and risk analysis for all transactions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: Activity, label: "Scanned", value: String(transactions.length), color: "neon-purple", border: "neon-purple" },
          { icon: XCircle, label: "Cancelled", value: String(rejectedCount), color: "destructive", border: "destructive" },
          { icon: CheckCircle2, label: "Approved", value: String(approvedCount), color: "success", border: "success" },
          { icon: Clock, label: "Pending", value: String(pendingCount), color: "warning", border: "warning" },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className={`p-6 rounded-xl bg-card border border-border hover:border-[var(--${s.border})]/50 transition-all`}>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--${s.color})]/20 to-[var(--neon-blue)]/20 flex items-center justify-center mb-4">
                <Icon className={`w-5 h-5 text-[var(--${s.color})]`} />
              </div>
              <p className="text-sm text-muted-foreground mb-1">{s.label}</p>
              <h3 className="text-2xl">{s.value}</h3>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-xl bg-card border border-border">
            <h3 className="mb-4">Transactions</h3>
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} onClick={() => { setSelected(tx); handleAnalyze(tx); }}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${selected?.id === tx.id ? "bg-[var(--neon-purple)]/10 border-2 border-[var(--neon-purple)]" : "bg-secondary/50 border border-border hover:border-[var(--neon-purple)]/30"}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tx.riskLevel === "high" || tx.riskLevel === "critical" ? "bg-[var(--destructive)]/10 text-[var(--destructive)]" : tx.riskLevel === "medium" ? "bg-[var(--warning)]/10 text-[var(--warning)]" : "bg-[var(--success)]/10 text-[var(--success)]"}`}>
                        {tx.status === "rejected" ? <XCircle className="w-5 h-5" /> : tx.status === "approved" ? <CheckCircle2 className="w-5 h-5" /> : tx.riskScore >= 70 ? <XCircle className="w-5 h-5" /> : tx.riskScore >= 40 ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span>To: {tx.to}</span>
                          <span className={`px-2 py-0.5 rounded text-xs ${tx.riskLevel === "high" || tx.riskLevel === "critical" ? "bg-[var(--destructive)]/10 text-[var(--destructive)]" : tx.riskLevel === "medium" ? "bg-[var(--warning)]/10 text-[var(--warning)]" : "bg-[var(--success)]/10 text-[var(--success)]"}`}>{tx.riskLevel} risk</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{formatTime(tx.timestamp)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="mb-1">{tx.amount}</p>
                      <span className={`text-xs px-2 py-1 rounded ${tx.status === "pending" ? "bg-[var(--warning)]/10 text-[var(--warning)]" : tx.status === "rejected" ? "bg-destructive/10 text-destructive" : "bg-[var(--success)]/10 text-[var(--success)]"}`}>{tx.status}</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${tx.riskLevel === "high" || tx.riskLevel === "critical" ? "bg-[var(--destructive)]" : tx.riskLevel === "medium" ? "bg-[var(--warning)]" : "bg-[var(--success)]"}`} style={{ width: `${tx.riskScore}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selected && selected.status === "pending" && (
            <div className="p-6 rounded-xl bg-card border border-[var(--warning)]/30">
              <h3 className="mb-4">Transaction Actions</h3>
              <div className="flex gap-3">
                <button
                  onClick={handleApprove}
                  disabled={actionInProgress !== null}
                  className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] text-white hover:shadow-lg hover:shadow-[var(--neon-purple)]/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionInProgress === "approve" ? (
                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Processing...</>
                  ) : (
                    <><CheckCircle2 className="w-5 h-5" />Approve Transaction</>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={actionInProgress !== null}
                  className="flex-1 px-6 py-3 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionInProgress === "cancel" ? (
                    <><div className="w-5 h-5 border-2 border-destructive/30 border-t-destructive rounded-full animate-spin"></div> Processing...</>
                  ) : (
                    <><XCircle className="w-5 h-5" />Cancel Transaction</>
                  )}
                </button>
              </div>
              {settings.voiceAuth && (
                <div className="mt-4 p-4 rounded-lg bg-[var(--neon-blue)]/5 border border-[var(--neon-blue)]/20 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-[var(--neon-blue)] mt-0.5" />
                  <div>
                    <h4 className="mb-1 text-[var(--neon-blue)]">Voice Protection Enabled</h4>
                    <p className="text-sm text-muted-foreground">Voice confirmation will play for transaction actions</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {selected && (
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--neon-purple)]/20 to-[var(--neon-blue)]/20 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-[var(--neon-purple)]" />
                </div>
                <div>
                  <h3>AI Risk Analysis</h3>
                  {isAnalyzing && <p className="text-xs text-muted-foreground">Analyzing...</p>}
                </div>
              </div>
              <RiskMeter score={selected.riskScore} />
              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="mb-2">Risk Factors</h4>
                  <div className="space-y-2">
                    {selected.reasons.map((r, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="w-4 h-4 text-[var(--warning)] mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                  <h4 className="mb-2 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-[var(--neon-cyan)]" />AI Explanation
                  </h4>
                  <p className="text-sm text-muted-foreground">{selected.aiExplanation}</p>
                </div>
              </div>
            </div>
          )}

          <div className="p-6 rounded-xl bg-gradient-to-br from-[var(--neon-purple)]/10 to-[var(--neon-blue)]/10 border border-[var(--neon-purple)]/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div><h4>Security Stats</h4><p className="text-xs text-muted-foreground">This session</p></div>
            </div>
            <div className="space-y-3">
              {[{ label: "Scanned", value: String(transactions.length), color: "neon-cyan" }, { label: "Pending", value: String(pendingCount), color: "warning" }, { label: "Approved", value: String(approvedCount), color: "success" }, { label: "Cancelled", value: String(rejectedCount), color: "destructive" }].map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{s.label}</span>
                  <span className={`text-[var(--${s.color})] font-medium`}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

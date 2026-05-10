import { GraduationCap, Coins, CheckCircle2, Clock, Users, TrendingUp, XCircle, Loader2 } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { useState } from "react";

function formatTimestamp(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "1 week ago";
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}

export default function Scholarships() {
  const { scholarships, pendingApprovals, donorDeposits, voteOnMilestone } = useAppContext();
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [votingId, setVotingId] = useState<string | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleVote = async (approvalId: string, vote: "approve" | "reject") => {
    const approval = pendingApprovals.find((a) => a.id === approvalId);
    if (!approval || approval.myVote !== "none") return;

    setVotingId(approvalId);
    try {
      voteOnMilestone(approvalId, vote);
      showNotification("success", `Vote recorded: ${vote === "approve" ? "Approved" : "Rejected"} ${approval.milestone}`);
    } catch (error) {
      showNotification("error", "Failed to record vote");
    } finally {
      setVotingId(null);
    }
  };

  const getProgressForScholarship = (s: typeof scholarships[0]) => {
    const completed = s.milestones.filter((m) => m.isCompleted).length;
    if (s.milestones.length === 0) return 0;
    return Math.round((completed / s.milestones.length) * 100);
  };

  const getTotalReleased = (s: typeof scholarships[0]) => {
    return s.milestones.filter((m) => m.isCompleted).reduce((sum, m) => sum + m.amount, 0);
  };

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
        <h1 className="mb-2">Scholarship Management</h1>
        <p className="text-muted-foreground">Manage blockchain-based scholarships with transparent milestone tracking</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: GraduationCap, label: "Active Scholarships", value: String(scholarships.length), color: "neon-purple", border: "neon-purple" },
          { icon: Coins, label: "Total Funds", value: "105 SOL", color: "neon-cyan", border: "neon-cyan" },
          { icon: CheckCircle2, label: "Funds Released", value: "42 SOL", color: "success", border: "success" },
          { icon: Clock, label: "Pending Approvals", value: String(pendingApprovals.filter((a) => a.myVote === "none").length), color: "warning", border: "warning" },
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between mb-6">
            <h3>Active Scholarships</h3>
          </div>
          <div className="space-y-4">
            {scholarships.map((s) => {
              const progress = getProgressForScholarship(s);
              const released = getTotalReleased(s);
              const remaining = s.totalAmount - released;

              return (
                <div key={s.id} className="p-4 rounded-lg bg-secondary/50 border border-border hover:border-[var(--neon-purple)]/30 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="mb-1">{s.name}</h4>
                      <p className="text-sm text-muted-foreground">Student: {s.student}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${s.isActive ? "bg-[var(--success)]/10 text-[var(--success)]" : "bg-muted text-muted-foreground"}`}>
                      {s.isActive ? "Active" : "Completed"}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div><p className="text-xs text-muted-foreground mb-1">Total</p><p className="text-sm">{s.totalAmount} SOL</p></div>
                    <div><p className="text-xs text-muted-foreground mb-1">Released</p><p className="text-sm text-[var(--success)]">{released} SOL</p></div>
                    <div><p className="text-xs text-muted-foreground mb-1">Remaining</p><p className="text-sm text-[var(--neon-cyan)]">{Math.max(0, remaining)} SOL</p></div>
                  </div>
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">Progress</span>
                      <span className="text-xs text-foreground">{progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-cyan)] rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {s.milestones.map((m) => (
                      <div key={m.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          {m.isCompleted ? <CheckCircle2 className="w-4 h-4 text-[var(--success)]" /> : m.isApproved ? <Clock className="w-4 h-4 text-[var(--neon-cyan)]" /> : <Clock className="w-4 h-4 text-muted-foreground" />}
                          <span className={m.isCompleted ? "text-muted-foreground line-through" : ""}>{m.description}</span>
                          {m.approvalCount > 0 && <span className="text-xs text-muted-foreground">({m.approvalCount} votes)</span>}
                        </div>
                        <span className="text-muted-foreground">{m.amount} SOL</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-card border border-border">
            <h3 className="mb-4">Pending Milestone Approvals</h3>
            {pendingApprovals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No pending approvals</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingApprovals.map((a) => (
                  <div key={a.id} className={`p-4 rounded-lg border ${a.myVote !== "none" ? "bg-secondary/30 border-border" : "bg-secondary/50 border-[var(--warning)]/30"}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="mb-1">{a.milestone}</h4>
                        <p className="text-sm text-muted-foreground">{a.student}</p>
                      </div>
                      <span className="text-[var(--neon-cyan)]">{a.amount}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Committee Votes</span>
                          <span className="text-foreground">{a.currentVotes}/{a.requiredVotes}</span>
                        </div>
                        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-[var(--warning)] rounded-full transition-all" style={{ width: `${(a.currentVotes / a.requiredVotes) * 100}%` }}></div>
                        </div>
                      </div>
                    </div>
                    {a.documents.length > 0 && (
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className="text-xs text-muted-foreground">Documents:</span>
                        {a.documents.map((d, idx) => <span key={idx} className="px-2 py-1 rounded bg-secondary border border-border text-xs">{d}</span>)}
                      </div>
                    )}
                    {a.myVote !== "none" ? (
                      <div className={`p-2 rounded text-center text-sm ${a.myVote === "approve" ? "bg-[var(--success)]/10 text-[var(--success)]" : "bg-destructive/10 text-destructive"}`}>
                        You voted: {a.myVote === "approve" ? "Approved" : "Rejected"}
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleVote(a.id, "approve")}
                          disabled={votingId === a.id}
                          className="flex-1 px-4 py-2 text-sm rounded-lg bg-[var(--success)]/10 text-[var(--success)] hover:bg-[var(--success)]/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {votingId === a.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                          Approve
                        </button>
                        <button
                          onClick={() => handleVote(a.id, "reject")}
                          disabled={votingId === a.id}
                          className="flex-1 px-4 py-2 text-sm rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {votingId === a.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 rounded-xl bg-card border border-border">
            <h3 className="mb-4">Recent Donor Deposits</h3>
            <div className="space-y-3">
              {donorDeposits.map((d) => (
                <div key={d.id} className="p-4 rounded-lg bg-secondary/50 border border-border hover:border-[var(--neon-purple)]/30 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="mb-1">{d.donor}</h4>
                      <p className="text-xs text-muted-foreground">{d.address}</p>
                    </div>
                    <span className="text-[var(--success)] font-medium">{d.amount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{d.scholarships} scholarships funded</span>
                    <span className="text-xs text-muted-foreground">{formatTimestamp(d.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

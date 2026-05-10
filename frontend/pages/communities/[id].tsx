import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";
import {
  Users, Heart, Target, ArrowLeft, CheckCircle2, XCircle, Clock, UserPlus, X,
  Percent, Gift, TrendingUp, CalendarDays, Loader2, ChevronDown, ChevronUp, Shield, AlertCircle
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { Community, JoinApplication, Donation, StipendConfig, StipendFrequency } from "../../types";

function JoinModal({ communityId, onClose }: { communityId: string; onClose: () => void }) {
  const { applyToJoin } = useAppContext();
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (!name.trim() || !reason.trim()) return;
    applyToJoin(communityId, name.trim(), reason.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3>Apply to Join</h3>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Your Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name"
              className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[var(--neon-purple)]" />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Why do you want to join?</label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Tell the community about yourself..." rows={3}
              className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[var(--neon-purple)] resize-none" />
          </div>
        </div>
        <div className="p-6 border-t border-border flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="px-6 py-2 rounded-lg bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] text-white hover:shadow-lg transition-all">Submit Application</button>
        </div>
      </div>
    </div>
  );
}

function DonateCommunityModal({ communityId, communityName, onClose }: { communityId: string; communityName: string; onClose: () => void }) {
  const { donateToCommunity, platformFee } = useAppContext();
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const presets = [10, 25, 50, 100, 500];
  const donationAmount = Number(amount) || 0;
  const fee = (donationAmount * platformFee.feePercent) / 100;
  const netAmount = donationAmount - fee;

  const handleDonate = () => {
    if (!donationAmount || donationAmount <= 0) return;
    donateToCommunity(communityId, name.trim(), donationAmount, message.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h3>Donate to {communityName}</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex gap-2 flex-wrap">
            {presets.map((p) => (
              <button key={p} onClick={() => setAmount(String(p))}
                className={`px-4 py-2 rounded-lg border text-sm transition-all ${Number(amount) === p ? "border-[var(--neon-purple)] bg-[var(--neon-purple)]/10 text-[var(--neon-purple)]" : "border-border bg-secondary text-foreground hover:border-[var(--neon-purple)]/50"}`}>
                ${p}
              </button>
            ))}
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Amount ($)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount"
              className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[var(--neon-purple)]" />
          </div>
          {donationAmount > 0 && (
            <div className="p-3 rounded-lg bg-secondary/50 border border-border space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Donation</span><span>${donationAmount.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Platform Fee ({platformFee.feePercent}%)</span><span className="text-[var(--warning)]">-${fee.toFixed(2)}</span></div>
              <div className="flex justify-between font-medium border-t border-border pt-1"><span>Community Receives</span><span className="text-[var(--success)]">${netAmount.toFixed(2)}</span></div>
            </div>
          )}
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Your Name (optional)</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Anonymous"
              className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[var(--neon-purple)]" />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Message (optional)</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Leave a note..." rows={2}
              className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[var(--neon-purple)] resize-none" />
          </div>
        </div>
        <div className="p-6 border-t border-border">
          <button onClick={handleDonate} disabled={!donationAmount || donationAmount <= 0}
            className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            <Heart className="w-5 h-5" /> Donate ${donationAmount || 0}
          </button>
        </div>
      </div>
    </div>
  );
}

function StipendConfigModal({ communityId, currentConfig, onClose }: { communityId: string; currentConfig?: StipendConfig; onClose: () => void }) {
  const { setStipendConfig, platformFee } = useAppContext();
  const [amount, setAmount] = useState(String(currentConfig?.amountPerMember || "0.5"));
  const [frequency, setFrequency] = useState<StipendFrequency>(currentConfig?.frequency || "monthly");

  const handleSubmit = () => {
    if (!Number(amount) || Number(amount) <= 0) return;
    setStipendConfig(communityId, { amountPerMember: Number(amount), frequency, lastDistributedAt: currentConfig?.lastDistributedAt, totalDistributed: currentConfig?.totalDistributed || 0 });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3>Stipend Configuration</h3>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Amount per Member ($)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} step="0.1"
              className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[var(--neon-purple)]" />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Frequency</label>
            <div className="grid grid-cols-2 gap-2">
              {(["weekly", "biweekly", "monthly", "milestone"] as StipendFrequency[]).map((f) => (
                <button key={f} onClick={() => setFrequency(f)}
                  className={`px-4 py-2 rounded-lg border text-sm capitalize transition-all ${frequency === f ? "border-[var(--neon-purple)] bg-[var(--neon-purple)]/10 text-[var(--neon-purple)]" : "border-border bg-secondary text-foreground hover:border-[var(--neon-purple)]/50"}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-[var(--neon-blue)]/5 border border-[var(--neon-blue)]/20">
                    <p className="text-xs text-muted-foreground">A {platformFee.feePercent}% platform fee applies to each stipend distribution.</p>
          </div>
        </div>
        <div className="p-6 border-t border-border flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-secondary text-foreground hover:bg-secondary/80">Cancel</button>
          <button onClick={handleSubmit} className="px-6 py-2 rounded-lg bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] text-white hover:shadow-lg">Save</button>
        </div>
      </div>
    </div>
  );
}

function ApplicationReview({ application, communityId, onReview }: { application: JoinApplication; communityId: string; onReview: () => void }) {
  const { reviewApplication } = useAppContext();
  const [note, setNote] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleReview = async (accept: boolean) => {
    setProcessing(true);
    reviewApplication(communityId, application.id, accept, note || undefined);
    setProcessing(false);
    onReview();
  };

  return (
    <div className="p-4 rounded-lg bg-secondary/50 border border-border">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="mb-1">{application.applicantName}</h4>
          <p className="text-xs text-muted-foreground">Applied {Math.floor((Date.now() - application.appliedAt) / 86400000)}d ago</p>
        </div>
        <span className={`px-2 py-0.5 rounded text-xs capitalize ${
          application.status === "pending" ? "bg-[var(--warning)]/10 text-[var(--warning)]"
          : application.status === "approved" ? "bg-[var(--success)]/10 text-[var(--success)]"
          : "bg-destructive/10 text-destructive"
        }`}>{application.status}</span>
      </div>
      {application.reason && <p className="text-sm text-muted-foreground mb-3 italic">"{application.reason}"</p>}
      {application.status === "pending" && (
        <div className="space-y-2">
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Review note (optional)"
            className="w-full px-3 py-2 text-sm rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[var(--neon-purple)]" />
          <div className="flex gap-2">
            <button onClick={() => handleReview(true)} disabled={processing}
              className="flex-1 px-3 py-2 text-sm rounded-lg bg-[var(--success)]/10 text-[var(--success)] hover:bg-[var(--success)]/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-1">
              {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Accept
            </button>
            <button onClick={() => handleReview(false)} disabled={processing}
              className="flex-1 px-3 py-2 text-sm rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-1">
              <XCircle className="w-4 h-4" /> Reject
            </button>
          </div>
        </div>
      )}
      {application.reviewNote && (
        <p className="text-xs text-muted-foreground mt-2">Note: {application.reviewNote}</p>
      )}
    </div>
  );
}

export default function CommunityDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { communities, scholarships, platformFee, donateToCommunity, distributeStipends } = useAppContext();
  const [showJoin, setShowJoin] = useState(false);
  const [showDonate, setShowDonate] = useState(false);
  const [showStipendConfig, setShowStipendConfig] = useState(false);
  const [showApplications, setShowApplications] = useState(false);
  const [distributing, setDistributing] = useState(false);
  const [distributingResult, setDistributingResult] = useState<string | null>(null);

  const community = communities.find((c) => c.id === id);
  const linkedScholarships = scholarships.filter((s) => s.communityId === id);
  if (!community) {
    return (
      <div className="space-y-6">
        <Link href="/communities" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Communities
        </Link>
        <div className="p-12 text-center rounded-xl bg-card border border-border">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="mb-2">Community not found</h3>
          <p className="text-muted-foreground">The community you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const progress = Math.min(Math.round((community.currentBalance / community.fundingGoal) * 100), 100);
  const pendingApps = community.applications.filter((a) => a.status === "pending").length;
  const activeMembers = community.members.filter((m) => m.isActive);

  const handleDistribute = async () => {
    setDistributing(true);
    setDistributingResult(null);
    const result = distributeStipends(community.id);
    if (result) {
      setDistributingResult(`Distributed $${result.totalAmount.toFixed(2)} to ${result.recipients} members`);
    } else {
      setDistributingResult("Distribution failed. Check balance and stipend config.");
    }
    setDistributing(false);
  };

  return (
    <div className="space-y-6">
      <Link href="/communities" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Communities
      </Link>

      <div className="p-6 rounded-xl bg-card border border-border">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--neon-purple)]/20 to-[var(--neon-blue)]/20 flex items-center justify-center">
              <Users className="w-8 h-8 text-[var(--neon-purple)]" />
            </div>
            <div>
              <h1 className="mb-1">{community.name}</h1>
              <p className="text-muted-foreground">{community.description}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><UserPlus className="w-4 h-4" /> Admin: {community.adminName}</span>
                <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {community.memberCount} members</span>
                <span className="flex items-center gap-1"><CalendarDays className="w-4 h-4" /> Created {Math.floor((Date.now() - community.createdAt) / 86400000)}d ago</span>
              </div>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-[var(--success)]/10 text-[var(--success)] text-sm">Active</span>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-[var(--neon-cyan)]" />
              <span className="text-muted-foreground">Funding Progress</span>
            </div>
            <span className="font-medium">${community.currentBalance.toLocaleString()} / ${community.fundingGoal.toLocaleString()}</span>
          </div>
          <div className="w-full h-4 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-cyan)] rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between mt-1 text-sm text-muted-foreground">
            <span>{progress}% funded</span>
            <span>${(community.fundingGoal - community.currentBalance).toLocaleString()} remaining</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <button onClick={() => setShowDonate(true)}
            className="p-4 rounded-lg bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] text-white hover:shadow-lg transition-all flex items-center justify-center gap-2">
            <Heart className="w-5 h-5" /> Donate
          </button>
          <button onClick={() => setShowJoin(true)}
            className="p-4 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 transition-all flex items-center justify-center gap-2 border border-border">
            <UserPlus className="w-5 h-5" /> Join
          </button>
          <button onClick={() => setShowStipendConfig(true)}
            className="p-4 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 transition-all flex items-center justify-center gap-2 border border-border">
            <Gift className="w-5 h-5" /> Stipends
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {pendingApps > 0 && (
            <div className="p-4 rounded-xl bg-card border border-[var(--warning)]/30">
              <button onClick={() => setShowApplications(!showApplications)}
                className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[var(--warning)]" />
                  <h3>Pending Applications ({pendingApps})</h3>
                </div>
                {showApplications ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {showApplications && (
                <div className="mt-4 space-y-3">
                  {community.applications.filter((a) => a.status === "pending").map((app) => (
                    <ApplicationReview key={app.id} application={app} communityId={community.id} onReview={() => {}} />
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="p-6 rounded-xl bg-card border border-border">
            <h3 className="mb-4">Members ({activeMembers.length})</h3>
            <div className="space-y-2">
              {activeMembers.map((m) => (
                <div key={m.id} className="p-3 rounded-lg bg-secondary/50 border border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                      m.role === "admin" ? "bg-[var(--neon-purple)]/20 text-[var(--neon-purple)]"
                      : "bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)]"}`}>
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm">{m.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{m.role}</span>
                        <span>|</span>
                        <span>Received: ${m.totalStipendsReceived.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    m.role === "admin" ? "bg-[var(--neon-purple)]/10 text-[var(--neon-purple)]"
                    : "bg-[var(--success)]/10 text-[var(--success)]"}`}>
                    {m.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-xl bg-card border border-border">
            <h3 className="mb-4">Stipend History</h3>
            {community.stipendDistributions.length === 0 ? (
              <p className="text-muted-foreground text-sm">No stipends distributed yet.</p>
            ) : (
              <div className="space-y-2">
                {community.stipendDistributions.slice().reverse().map((sd) => (
                  <div key={sd.id} className="p-3 rounded-lg bg-secondary/50 border border-border flex items-center justify-between text-sm">
                    <div>
                      <span className="text-[var(--success)]">${sd.totalAmount.toFixed(2)}</span>
                      <span className="text-muted-foreground mx-2">to</span>
                      <span>{sd.recipients} members</span>
                      {sd.fee && <span className="text-xs text-muted-foreground ml-2">(fee: ${sd.fee.toFixed(2)})</span>}
                    </div>
                    <span className="text-xs text-muted-foreground">{Math.floor((Date.now() - sd.timestamp) / 86400000)}d ago</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 rounded-xl bg-card border border-border">
            <h3 className="mb-4">Donations ({community.donations.length})</h3>
            {community.donations.length === 0 ? (
              <p className="text-muted-foreground text-sm">No donations yet. Be the first!</p>
            ) : (
              <div className="space-y-2">
                {community.donations.slice().reverse().map((d) => (
                  <div key={d.id} className="p-3 rounded-lg bg-secondary/50 border border-border flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-[var(--destructive)]" />
                      <div>
                        <span>{d.donorName}</span>
                        {d.message && <span className="text-xs text-muted-foreground ml-2">"{d.message}"</span>}
                        {d.fee && <span className="text-xs text-muted-foreground ml-2">(fee: ${d.fee.toFixed(2)})</span>}
                      </div>
                    </div>
                    <span className="text-[var(--success)]">${d.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {linkedScholarships.length > 0 && (
            <div className="p-6 rounded-xl bg-card border border-border">
              <h3 className="mb-4">Linked Scholarships ({linkedScholarships.length})</h3>
              <div className="space-y-2">
                {linkedScholarships.map((s) => (
                  <div key={s.id} className="p-3 rounded-lg bg-secondary/50 border border-border flex items-center justify-between text-sm">
                    <div>
                      <span>{s.name}</span>
                      <span className="text-muted-foreground ml-2">Student: {s.student}</span>
                    </div>
                    <span className={s.isActive ? "text-[var(--success)]" : "text-muted-foreground"}>{s.isActive ? "Active" : "Completed"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-card border border-border">
            <h3 className="mb-4">Community Stats</h3>
            <div className="space-y-4">
              {[
                { label: "Total Funded", value: `$${community.currentBalance.toLocaleString()}`, color: "neon-cyan" },
                { label: "Funding Goal", value: `$${community.fundingGoal.toLocaleString()}`, color: "neon-purple" },
                { label: "Members", value: String(community.memberCount), color: "success" },
                { label: "Donations", value: String(community.donations.length), color: "warning" },
                { label: "Stipend Distributions", value: String(community.stipendDistributions.length), color: "neon-blue" },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{s.label}</span>
                  <span className={`font-medium text-[var(--${s.color})]`}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {community.stipendConfig && (
            <div className="p-6 rounded-xl bg-card border border-[var(--neon-cyan)]/30">
              <h3 className="mb-4">Stipend Config</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span>${community.stipendConfig.amountPerMember}/member</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Frequency</span><span className="capitalize">{community.stipendConfig.frequency}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Total Distributed</span><span className="text-[var(--success)]">${community.stipendConfig.totalDistributed.toFixed(2)}</span></div>
                {community.stipendConfig.lastDistributedAt && (
                  <div className="flex justify-between"><span className="text-muted-foreground">Last Distribution</span><span>{Math.floor((Date.now() - community.stipendConfig.lastDistributedAt) / 86400000)}d ago</span></div>
                )}
              </div>
              <div className="mt-4 space-y-2">
                <button onClick={handleDistribute} disabled={distributing}
                  className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-blue)] text-white hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {distributing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Gift className="w-5 h-5" />}
                  Distribute Stipends
                </button>
                {distributingResult && (
                  <div className="p-2 rounded-lg bg-[var(--success)]/10 text-[var(--success)] text-xs text-center">{distributingResult}</div>
                )}
              </div>
            </div>
          )}

          <div className="p-6 rounded-xl bg-card border border-border">
            <h3 className="mb-4">Fee Info</h3>
            <div className="flex items-center gap-2 mb-3">
              <Percent className="w-5 h-5 text-[var(--neon-cyan)]" />
              <span className="text-2xl font-bold text-[var(--neon-cyan)]">{platformFee.feePercent}%</span>
            </div>
            <p className="text-xs text-muted-foreground">Flat platform fee on all donations and stipend distributions.</p>
            <p className="text-xs text-muted-foreground mt-1">Treasury: {platformFee.treasuryWallet}</p>
          </div>
        </div>
      </div>

      {showJoin && <JoinModal communityId={community.id} onClose={() => setShowJoin(false)} />}
      {showDonate && <DonateCommunityModal communityId={community.id} communityName={community.name} onClose={() => setShowDonate(false)} />}
      {showStipendConfig && <StipendConfigModal communityId={community.id} currentConfig={community.stipendConfig} onClose={() => setShowStipendConfig(false)} />}
    </div>
  );
}

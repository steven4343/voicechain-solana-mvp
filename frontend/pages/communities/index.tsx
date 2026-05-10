import { useState } from "react";
import Link from "next/link";
import { Users, Heart, TrendingUp, Target, Plus, X, UserPlus, CalendarDays, ChevronDown, ChevronUp, Shield, Percent } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { Community } from "../../types";

function CreateCommunityModal({ onClose }: { onClose: () => void }) {
  const { createCommunity } = useAppContext();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");

  const handleSubmit = () => {
    if (!name.trim() || !goal.trim()) return;
    createCommunity(name.trim(), description.trim(), Number(goal));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3>Create New Community</h3>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Community Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Web3 Scholars DAO"
              className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[var(--neon-purple)]" />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What is this community about?" rows={3}
              className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[var(--neon-purple)] resize-none" />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Funding Goal ($)</label>
            <input type="number" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="25000"
              className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[var(--neon-purple)]" />
          </div>
          <div className="p-4 rounded-lg bg-[var(--neon-blue)]/5 border border-[var(--neon-blue)]/20">
            <div className="flex items-center gap-2 text-sm mb-1">
              <Percent className="w-4 h-4 text-[var(--neon-cyan)]" />
              <span className="text-foreground font-medium">Platform Fee: 2.5%</span>
            </div>
            <p className="text-xs text-muted-foreground">A flat 2.5% fee applies to all donations and stipend distributions. Funds the VoiceChain platform operations.</p>
          </div>
        </div>
        <div className="p-6 border-t border-border flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="px-6 py-2 rounded-lg bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] text-white hover:shadow-lg transition-all">Create Community</button>
        </div>
      </div>
    </div>
  );
}

function CommunityCard({ community }: { community: Community }) {
  const progress = Math.min(Math.round((community.currentBalance / community.fundingGoal) * 100), 100);

  return (
    <Link href={`/communities/${community.id}`} className="block">
      <div className="p-6 rounded-xl bg-card border border-border hover:border-[var(--neon-purple)]/50 transition-all group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--neon-purple)]/20 to-[var(--neon-blue)]/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-[var(--neon-purple)]" />
            </div>
            <div>
              <h3 className="mb-1 group-hover:text-[var(--neon-purple)] transition-colors">{community.name}</h3>
              <p className="text-sm text-muted-foreground max-w-lg line-clamp-2">{community.description}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><UserPlus className="w-3 h-3" /> {community.adminName}</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {community.memberCount} members</span>
                <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" /> {Math.floor((Date.now() - community.createdAt) / 86400000)}d ago</span>
              </div>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-[var(--success)]/10 text-[var(--success)] text-xs">Active</span>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[var(--neon-cyan)]" />
              <span className="text-sm text-muted-foreground">Funding Progress</span>
            </div>
            <span className="text-sm font-medium">${community.currentBalance.toLocaleString()} / ${community.fundingGoal.toLocaleString()}</span>
          </div>
          <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-cyan)] rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground">{progress}% funded</span>
            <span className="text-xs text-muted-foreground">{community.donations.length} donations</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 rounded-lg bg-secondary/30 border border-border text-center">
            <p className="text-xs text-muted-foreground mb-1">Members</p>
            <p className="text-lg">{community.memberCount}</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/30 border border-border text-center">
            <p className="text-xs text-muted-foreground mb-1">Stipends</p>
            <p className="text-lg">{community.stipendDistributions.length}</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/30 border border-border text-center">
            <p className="text-xs text-muted-foreground mb-1">Balance</p>
            <p className="text-lg">${community.currentBalance.toLocaleString()}</p>
          </div>
        </div>

        {community.stipendConfig && (
          <div className="mt-3 p-2 rounded-lg bg-[var(--neon-cyan)]/5 border border-[var(--neon-cyan)]/20 flex items-center gap-2">
            <Heart className="w-4 h-4 text-[var(--neon-cyan)]" />
            <span className="text-xs text-muted-foreground">Stipend: ${community.stipendConfig.amountPerMember}/member ({community.stipendConfig.frequency})</span>
          </div>
        )}
      </div>
    </Link>
  );
}

export default function CommunitiesPage() {
  const { communities, platformFee } = useAppContext();
  const [showCreate, setShowCreate] = useState(false);

  const totalMembers = communities.reduce((s, c) => s + c.memberCount, 0);
  const totalBalance = communities.reduce((s, c) => s + c.currentBalance, 0);
  const totalDonors = new Set(communities.flatMap((c) => c.donations.map((d) => d.donor))).size;
  const pendingApps = communities.reduce((s, c) => s + c.applications.filter((a) => a.status === "pending").length, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Communities</h1>
          <p className="text-muted-foreground">Create or join a community. Donors fund members, admins manage stipends.</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] text-white hover:shadow-lg transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Community
        </button>
      </div>

      <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--neon-blue)]/5 border border-[var(--neon-blue)]/20">
        <Percent className="w-4 h-4 text-[var(--neon-cyan)]" />
        <span className="text-sm"><strong>Platform Fee:</strong> {platformFee.feePercent}% flat rate on all donations and stipend distributions.</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: Users, label: "Communities", value: String(communities.length), color: "neon-purple", border: "neon-purple" },
          { icon: Users, label: "Total Members", value: String(totalMembers), color: "neon-cyan", border: "neon-cyan" },
          { icon: Heart, label: "Total Donors", value: String(totalDonors), color: "success", border: "success" },
          { icon: TrendingUp, label: "Total Funded", value: `$${totalBalance.toLocaleString()}`, color: "warning", border: "warning" },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className={`p-6 rounded-xl bg-card border border-border hover:border-[var(--${s.border})]/50 transition-all`}>
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--${s.color})]/20 to-[var(--neon-blue)]/20 flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 text-[var(--${s.color})]`} />
              </div>
              <p className="text-sm text-muted-foreground mb-1">{s.label}</p>
              <h3 className="text-2xl">{s.value}</h3>
            </div>
          );
        })}
      </div>

      {pendingApps > 0 && (
        <div className="p-4 rounded-lg bg-[var(--warning)]/10 border border-[var(--warning)]/30 flex items-center gap-3">
          <Shield className="w-5 h-5 text-[var(--warning)]" />
          <span className="text-sm">{pendingApps} pending application{pendingApps > 1 ? "s" : ""} need{pendingApps === 1 ? "s" : ""} review</span>
        </div>
      )}

      {communities.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-card border border-border">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="mb-2">No communities yet</h3>
          <p className="text-muted-foreground mb-6">Create the first community on VoiceChain!</p>
          <button onClick={() => setShowCreate(true)}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] text-white hover:shadow-lg transition-all">
            Create Community
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {communities.map((community) => <CommunityCard key={community.id} community={community} />)}
        </div>
      )}

      {showCreate && <CreateCommunityModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}

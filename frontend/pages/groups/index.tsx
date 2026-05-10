import { useState } from "react";
import { Users, Heart, TrendingUp, CheckCircle2, Plus, X, UserPlus, Gift, Target, CalendarDays, ChevronDown, ChevronUp } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { Group, Donation } from "../../types";

function CreateGroupModal({ onClose }: { onClose: () => void }) {
  const { groups, setGroups } = useAppContext();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [recipients, setRecipients] = useState([{ name: "", description: "" }]);

  const addRecipient = () => setRecipients([...recipients, { name: "", description: "" }]);
  const removeRecipient = (i: number) => setRecipients(recipients.filter((_, idx) => idx !== i));
  const updateRecipient = (i: number, field: string, value: string) => {
    const updated = recipients.map((r, idx) => (idx === i ? { ...r, [field]: value } : r));
    setRecipients(updated);
  };

  const handleSubmit = () => {
    if (!name.trim() || !goal.trim()) return;
    const newGroup: Group = {
      id: `grp_${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      creator: "You",
      memberCount: 1,
      totalFundingGoal: Number(goal),
      totalFunded: 0,
      isActive: true,
      recipients: recipients.filter((r) => r.name.trim()).map((r, i) => ({
        id: `r_${Date.now()}_${i}`,
        name: r.name.trim(),
        description: r.description.trim(),
        amountReceived: 0,
      })),
      donations: [],
      createdAt: Date.now(),
    };
    setGroups([newGroup, ...groups]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto mx-4">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3>Create New Group</h3>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Group Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Community Garden Project"
              className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[var(--neon-purple)]"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell donors what this group aims to achieve..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[var(--neon-purple)] resize-none"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Funding Goal ($)</label>
            <input
              type="number"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="10000"
              className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[var(--neon-purple)]"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-muted-foreground">Recipients (people to fund)</label>
              <button onClick={addRecipient} className="text-sm text-[var(--neon-purple)] hover:text-[var(--neon-blue)] transition-colors flex items-center gap-1">
                <UserPlus className="w-4 h-4" /> Add Person
              </button>
            </div>
            <div className="space-y-2">
              {recipients.map((r, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={r.name}
                    onChange={(e) => updateRecipient(i, "name", e.target.value)}
                    placeholder="Name"
                    className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-[var(--neon-purple)]"
                  />
                  <input
                    value={r.description}
                    onChange={(e) => updateRecipient(i, "description", e.target.value)}
                    placeholder="Purpose"
                    className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-[var(--neon-purple)]"
                  />
                  {recipients.length > 1 && (
                    <button onClick={() => removeRecipient(i)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-border flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="px-6 py-2 rounded-lg bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] text-white hover:shadow-lg transition-all">Create Group</button>
        </div>
      </div>
    </div>
  );
}

function DonateModal({ group, onClose }: { group: Group; onClose: () => void }) {
  const { addDonation } = useAppContext();
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const presets = [25, 50, 100, 250, 500];

  const handleDonate = () => {
    const donationAmount = Number(amount);
    if (!donationAmount || donationAmount <= 0) return;
    const donation: Donation = {
      id: `d_${Date.now()}`,
      donor: name.trim() || "anon_" + Date.now(),
      donorName: name.trim() || "Anonymous",
      amount: donationAmount,
      groupId: group.id,
      timestamp: Date.now(),
      message: message.trim() || undefined,
    };
    addDonation(donation);
    onClose();
  };

  const remaining = group.totalFundingGoal - group.totalFunded;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h3>Donate to {group.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">${remaining.toLocaleString()} still needed</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex gap-2 flex-wrap">
            {presets.map((p) => (
              <button
                key={p}
                onClick={() => setAmount(String(p))}
                className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                  Number(amount) === p
                    ? "border-[var(--neon-purple)] bg-[var(--neon-purple)]/10 text-[var(--neon-purple)]"
                    : "border-border bg-secondary text-foreground hover:border-[var(--neon-purple)]/50"
                }`}
              >
                ${p}
              </button>
            ))}
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Custom Amount ($)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[var(--neon-purple)]"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Your Name (optional)</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Anonymous"
              className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[var(--neon-purple)]"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Message (optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Leave a note of encouragement..."
              rows={2}
              className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[var(--neon-purple)] resize-none"
            />
          </div>
        </div>
        <div className="p-6 border-t border-border">
          <button
            onClick={handleDonate}
            disabled={!amount || Number(amount) <= 0}
            className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Heart className="w-5 h-5" /> Donate ${Number(amount) || 0}
          </button>
        </div>
      </div>
    </div>
  );
}

function GroupCard({ group }: { group: Group }) {
  const [expanded, setExpanded] = useState(false);
  const [showDonate, setShowDonate] = useState(false);
  const progress = Math.min(Math.round((group.totalFunded / group.totalFundingGoal) * 100), 100);
  const remaining = group.totalFundingGoal - group.totalFunded;

  return (
    <>
      <div className="p-6 rounded-xl bg-card border border-border hover:border-[var(--neon-purple)]/50 transition-all">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--neon-purple)]/20 to-[var(--neon-blue)]/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-[var(--neon-purple)]" />
            </div>
            <div>
              <h3 className="mb-1">{group.name}</h3>
              <p className="text-sm text-muted-foreground max-w-lg">{group.description}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><UserPlus className="w-3 h-3" /> Created by {group.creator}</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {group.memberCount} members</span>
                <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" /> {Math.floor((Date.now() - group.createdAt) / 86400000)}d ago</span>
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
            <span className="text-sm font-medium">${group.totalFunded.toLocaleString()} / ${group.totalFundingGoal.toLocaleString()}</span>
          </div>
          <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-cyan)] rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground">{progress}% funded</span>
            <span className="text-xs text-[var(--warning)]">${remaining.toLocaleString()} remaining</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="p-3 rounded-lg bg-secondary/30 border border-border text-center">
            <p className="text-xs text-muted-foreground mb-1">Recipients</p>
            <p className="text-lg">{group.recipients.length}</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/30 border border-border text-center">
            <p className="text-xs text-muted-foreground mb-1">Donations</p>
            <p className="text-lg">{group.donations.length}</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/30 border border-border text-center">
            <p className="text-xs text-muted-foreground mb-1">Donors</p>
            <p className="text-lg">{new Set(group.donations.map((d) => d.donor)).size}</p>
          </div>
        </div>

        {group.recipients.length > 0 && (
          <div className="mb-4">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              Recipients ({group.recipients.length})
            </button>
            {expanded && (
              <div className="space-y-2">
                {group.recipients.map((r) => (
                  <div key={r.id} className="p-3 rounded-lg bg-secondary/50 border border-border flex items-center justify-between">
                    <div>
                      <p className="text-sm">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.description}</p>
                    </div>
                    <span className="text-sm text-[var(--success)]">${r.amountReceived.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {group.donations.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">Recent Donations</p>
            <div className="space-y-2">
              {group.donations.slice(-3).reverse().map((d) => (
                <div key={d.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Heart className="w-3 h-3 text-[var(--destructive)]" />
                    <span>{d.donorName}</span>
                    {d.message && <span className="text-xs text-muted-foreground">"{d.message}"</span>}
                  </div>
                  <span className="text-[var(--success)]">${d.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => setShowDonate(true)}
          disabled={remaining <= 0}
          className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Heart className="w-4 h-4" /> {remaining <= 0 ? "Fully Funded" : "Donate Now"}
        </button>
      </div>
      {showDonate && <DonateModal group={group} onClose={() => setShowDonate(false)} />}
    </>
  );
}

export default function GroupsPage() {
  const { groups } = useAppContext();
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState<"all" | "funded" | "active">("all");

  const filtered = groups.filter((g) => {
    if (filter === "funded") return g.totalFunded >= g.totalFundingGoal;
    if (filter === "active") return g.totalFunded < g.totalFundingGoal && g.isActive;
    return true;
  });

  const totalDonors = new Set(groups.flatMap((g) => g.donations.map((d) => d.donor))).size;
  const totalFunded = groups.reduce((sum, g) => sum + g.totalFunded, 0);
  const activeGroups = groups.filter((g) => g.isActive && g.totalFunded < g.totalFundingGoal).length;
  const totalRecipients = groups.reduce((sum, g) => sum + g.recipients.length, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Community Groups</h1>
          <p className="text-muted-foreground">Create funding groups, donate, and support people in your community</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] text-white hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Group
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 rounded-xl bg-card border border-border hover:border-[var(--neon-purple)]/50 transition-all">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--neon-purple)]/20 to-[var(--neon-blue)]/20 flex items-center justify-center mb-4">
            <Users className="w-5 h-5 text-[var(--neon-purple)]" />
          </div>
          <p className="text-sm text-muted-foreground mb-1">Total Groups</p>
          <h3 className="text-2xl">{groups.length}</h3>
        </div>
        <div className="p-6 rounded-xl bg-card border border-border hover:border-[var(--neon-cyan)]/50 transition-all">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--neon-cyan)]/20 to-[var(--neon-blue)]/20 flex items-center justify-center mb-4">
            <Heart className="w-5 h-5 text-[var(--neon-cyan)]" />
          </div>
          <p className="text-sm text-muted-foreground mb-1">Total Donors</p>
          <h3 className="text-2xl">{totalDonors}</h3>
        </div>
        <div className="p-6 rounded-xl bg-card border border-border hover:border-[var(--success)]/50 transition-all">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--success)]/20 to-[var(--neon-blue)]/20 flex items-center justify-center mb-4">
            <TrendingUp className="w-5 h-5 text-[var(--success)]" />
          </div>
          <p className="text-sm text-muted-foreground mb-1">Total Funded</p>
          <h3 className="text-2xl">${totalFunded.toLocaleString()}</h3>
        </div>
        <div className="p-6 rounded-xl bg-card border border-border hover:border-[var(--neon-blue)]/50 transition-all">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--neon-blue)]/20 to-[var(--neon-violet)]/20 flex items-center justify-center mb-4">
            <Target className="w-5 h-5 text-[var(--neon-blue)]" />
          </div>
          <p className="text-sm text-muted-foreground mb-1">Active Groups</p>
          <h3 className="text-2xl">{activeGroups}</h3>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {(["all", "active", "funded"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm transition-all capitalize ${
              filter === f
                ? "bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] text-white"
                : "bg-secondary text-foreground hover:bg-secondary/80"
            }`}
          >
            {f === "all" ? "All Groups" : f === "active" ? "Active" : "Fully Funded"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.length === 0 ? (
          <div className="lg:col-span-2 p-12 text-center rounded-xl bg-card border border-border">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="mb-2">No groups found</h3>
            <p className="text-muted-foreground mb-6">Be the first to create a community funding group!</p>
            <button
              onClick={() => setShowCreate(true)}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] text-white hover:shadow-lg transition-all"
            >
              Create Your First Group
            </button>
          </div>
        ) : (
          filtered.map((group) => <GroupCard key={group.id} group={group} />)
        )}
      </div>

      {showCreate && <CreateGroupModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}

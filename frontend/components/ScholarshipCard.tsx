import { Scholarship } from "../types";
import { BookOpen, Users, CheckCircle } from "lucide-react";

interface ScholarshipCardProps { scholarship: Scholarship }

export default function ScholarshipCard({ scholarship }: ScholarshipCardProps) {
  const progress = Math.round((scholarship.fundedAmount / scholarship.totalAmount) * 100);

  return (
    <div className="p-6 rounded-xl bg-card border border-border hover:border-[var(--neon-purple)]/50 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--neon-purple)]/20 to-[var(--neon-blue)]/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-[var(--neon-purple)]" />
          </div>
          <div>
            <h3 className="text-sm group-hover:text-[var(--neon-purple)] transition-colors">{scholarship.name}</h3>
            <p className="text-xs text-muted-foreground">Student: {scholarship.student}</p>
          </div>
        </div>
        <span className={`px-2 py-0.5 rounded text-xs ${scholarship.isActive ? "bg-[var(--success)]/10 text-[var(--success)]" : "bg-[var(--destructive)]/10 text-[var(--destructive)]"}`}>
          {scholarship.isActive ? "Active" : "Inactive"}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{scholarship.description}</p>
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Funding Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2.5">
          <div className="h-full bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-cyan)] rounded-full" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>{scholarship.fundedAmount} / {scholarship.totalAmount} SOL</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <CheckCircle className="w-4 h-4 text-[var(--success)]" />
          <span>{scholarship.milestones.filter((m) => m.isCompleted).length}/{scholarship.milestones.length} milestones</span>
        </div>
      </div>
    </div>
  );
}

import { Scholarship } from "../types";
import { BookOpen, Users, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

interface ScholarshipCardProps {
  scholarship: Scholarship;
}

export default function ScholarshipCard({ scholarship }: ScholarshipCardProps) {
  const progress = Math.round((scholarship.fundedAmount / scholarship.totalAmount) * 100);
  const completedMilestones = scholarship.milestones.filter((m) => m.isCompleted).length;
  const totalMilestones = scholarship.milestones.length;

  return (
    <Link href={`/scholarships/${scholarship.id}`}>
      <div className="glass-card p-6 hover:border-primary-500/50 transition-all cursor-pointer group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <h3 className="font-semibold group-hover:text-primary-400 transition-colors">{scholarship.name}</h3>
              <p className="text-xs text-dark-400">Student: {scholarship.student}</p>
            </div>
          </div>
          <span className={`badge ${scholarship.isActive ? "badge-success" : "badge-danger"}`}>
            {scholarship.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        <p className="text-sm text-dark-300 mb-4 line-clamp-2">{scholarship.description}</p>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-dark-400">Funding Progress</span>
            <span className="font-semibold">{progress}%</span>
          </div>
          <div className="w-full bg-dark-700 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-primary-500 to-accent-cyan h-2.5 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-dark-400">
            <Users className="w-4 h-4" />
            <span>{(scholarship.fundedAmount / 1e9).toFixed(1)} / {(scholarship.totalAmount / 1e9).toFixed(1)} SOL</span>
          </div>
          <div className="flex items-center gap-2 text-dark-400">
            <CheckCircle className="w-4 h-4 text-accent-green" />
            <span>
              {completedMilestones}/{totalMilestones} milestones
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

import { useRouter } from "next/router";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { ArrowLeft, CheckCircle, Clock, Users, Send, DollarSign } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { Milestone } from "../../types";
import Link from "next/link";

export default function ScholarshipDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { scholarships } = useAppContext();
  const { connected } = useWallet();
  const { connection } = useConnection();

  const scholarship = scholarships.find((s) => s.id === id);

  if (!scholarship) {
    return (
      <div className="glass-card p-12 text-center">
        <h2 className="text-xl font-semibold mb-2">Scholarship not found</h2>
        <Link href="/scholarships" className="text-primary-400 hover:underline">
          Back to Scholarships
        </Link>
      </div>
    );
  }

  const progress = Math.round((scholarship.fundedAmount / scholarship.totalAmount) * 100);

  return (
    <div>
      <Link href="/scholarships" className="flex items-center gap-2 text-dark-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Scholarships
      </Link>

      <div className="glass-card p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{scholarship.name}</h1>
            <p className="text-dark-400 mt-1">{scholarship.description}</p>
          </div>
          <span className={`badge ${scholarship.isActive ? "badge-success" : "badge-danger"}`}>
            {scholarship.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-dark-800/50 rounded-xl p-4">
            <p className="text-dark-400 text-sm mb-1">Funded</p>
            <p className="text-xl font-bold">{(scholarship.fundedAmount / 1e9).toFixed(2)} SOL</p>
          </div>
          <div className="bg-dark-800/50 rounded-xl p-4">
            <p className="text-dark-400 text-sm mb-1">Total Goal</p>
            <p className="text-xl font-bold">{(scholarship.totalAmount / 1e9).toFixed(2)} SOL</p>
          </div>
          <div className="bg-dark-800/50 rounded-xl p-4">
            <p className="text-dark-400 text-sm mb-1">Student</p>
            <p className="text-xl font-bold font-mono text-sm">{scholarship.student}</p>
          </div>
        </div>

        <div className="mb-2">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-dark-400">Progress</span>
            <span className="font-semibold">{progress}%</span>
          </div>
          <div className="w-full bg-dark-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-primary-500 to-accent-cyan h-3 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {connected && (
          <button className="btn-primary mt-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Donate to Scholarship
          </button>
        )}
      </div>

      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-4">Milestones</h2>
        <div className="space-y-3">
          {scholarship.milestones.map((milestone, index) => (
            <MilestoneRow key={milestone.id} milestone={milestone} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MilestoneRow({ milestone, index }: { milestone: Milestone; index: number }) {
  return (
    <div className="bg-dark-800/50 rounded-xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            milestone.isCompleted
              ? "bg-accent-green/20 text-accent-green"
              : milestone.isApproved
              ? "bg-accent-yellow/20 text-accent-yellow"
              : "bg-dark-600 text-dark-400"
          }`}
        >
          {milestone.isCompleted ? <CheckCircle className="w-5 h-5" /> : index + 1}
        </div>
        <div>
          <p className="font-medium">{milestone.description}</p>
          <p className="text-sm text-dark-400">{(milestone.amount / 1e9).toFixed(2)} SOL</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span
          className={`badge ${
            milestone.isCompleted ? "badge-success" : milestone.isApproved ? "badge-warning" : "badge-info"
          }`}
        >
          {milestone.isCompleted ? "Completed" : milestone.isApproved ? "Approved" : "Pending"}
        </span>
        {milestone.isApproved && !milestone.isCompleted && (
          <button className="btn-secondary text-sm px-3 py-1.5 flex items-center gap-1">
            <Send className="w-3 h-3" />
            Release
          </button>
        )}
      </div>
    </div>
  );
}

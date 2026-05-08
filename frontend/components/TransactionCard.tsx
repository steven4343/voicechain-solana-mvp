import { Transaction } from "../types";
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle } from "lucide-react";

interface TransactionCardProps {
  tx: Transaction;
}

export default function TransactionCard({ tx }: TransactionCardProps) {
  const formatTime = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  const truncate = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`;

  const getRiskBadge = (score: number) => {
    if (score >= 75) return <span className="badge badge-danger">High Risk</span>;
    if (score >= 40) return <span className="badge badge-warning">Medium Risk</span>;
    return <span className="badge badge-success">Safe</span>;
  };

  const getStatusIcon = () => {
    switch (tx.status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-accent-green" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-accent-red" />;
      default:
        return <Clock className="w-4 h-4 text-accent-yellow" />;
    }
  };

  return (
    <div className="glass-card p-4 flex items-center justify-between hover:border-dark-500 transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center">
          {tx.amount > 0 ? (
            <ArrowDownLeft className="w-5 h-5 text-accent-green" />
          ) : (
            <ArrowUpRight className="w-5 h-5 text-accent-red" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium">{truncate(tx.destination)}</p>
          <p className="text-xs text-dark-400">{formatTime(tx.timestamp)}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-semibold">
            {tx.amount > 0 ? "+" : ""}
            {(tx.amount / 1e9).toFixed(4)} SOL
          </p>
          <div className="flex items-center gap-1 justify-end">
            {getStatusIcon()}
            <span className="text-xs text-dark-400 capitalize">{tx.status}</span>
          </div>
        </div>
        {getRiskBadge(tx.riskScore)}
      </div>
    </div>
  );
}

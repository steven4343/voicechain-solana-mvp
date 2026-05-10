import { Transaction } from "../types";
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle } from "lucide-react";

interface TransactionCardProps { tx: Transaction }

export default function TransactionCard({ tx }: TransactionCardProps) {
  const truncate = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`;

  const getRiskBadge = (score: number) => {
    if (score >= 75) return <span className="px-2 py-0.5 rounded text-xs bg-[var(--destructive)]/10 text-[var(--destructive)]">High Risk</span>;
    if (score >= 40) return <span className="px-2 py-0.5 rounded text-xs bg-[var(--warning)]/10 text-[var(--warning)]">Medium Risk</span>;
    return <span className="px-2 py-0.5 rounded text-xs bg-[var(--success)]/10 text-[var(--success)]">Safe</span>;
  };

  const getStatusIcon = () => {
    switch (tx.status) {
      case "confirmed": return <CheckCircle className="w-4 h-4 text-[var(--success)]" />;
      case "failed": return <XCircle className="w-4 h-4 text-[var(--destructive)]" />;
      default: return <Clock className="w-4 h-4 text-[var(--warning)]" />;
    }
  };

  return (
    <div className="p-4 rounded-lg bg-secondary/50 border border-border flex items-center justify-between hover:border-[var(--neon-purple)]/30 transition-all">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          {tx.amount > 0 ? <ArrowDownLeft className="w-5 h-5 text-[var(--success)]" /> : <ArrowUpRight className="w-5 h-5 text-[var(--destructive)]" />}
        </div>
        <div>
          <p className="text-sm">{truncate(tx.destination)}</p>
          <p className="text-xs text-muted-foreground">{new Date(tx.timestamp).toLocaleTimeString()}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm">{(tx.amount / 1e9).toFixed(4)} SOL</p>
          <div className="flex items-center gap-1 justify-end">{getStatusIcon()}<span className="text-xs text-muted-foreground capitalize">{tx.status}</span></div>
        </div>
        {getRiskBadge(tx.riskScore)}
      </div>
    </div>
  );
}

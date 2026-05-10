interface RiskScoreCardProps {
  score: number;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export default function RiskScoreCard({ score, label = "Risk Score", size = "md" }: RiskScoreCardProps) {
  const getColor = (s: number) => {
    if (s >= 75) return "text-[var(--destructive)]";
    if (s >= 40) return "text-[var(--warning)]";
    return "text-[var(--success)]";
  };

  const getLevel = (s: number) => {
    if (s >= 90) return "CRITICAL";
    if (s >= 75) return "HIGH";
    if (s >= 40) return "MEDIUM";
    return "LOW";
  };

  const sizeClasses = { sm: "w-16 h-16", md: "w-24 h-24", lg: "w-32 h-32" };
  const textSizes = { sm: "text-2xl", md: "text-4xl", lg: "text-6xl" };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`${sizeClasses[size]} rounded-full bg-secondary border-2 border-[var(--border)] flex items-center justify-center shadow-lg`}>
        <span className={`font-bold font-mono ${textSizes[size]} ${getColor(score)}`}>{score}</span>
      </div>
      <span className="text-muted-foreground text-sm font-medium">{label}</span>
      <span className={`text-xs font-semibold ${getColor(score)}`}>{getLevel(score)}</span>
    </div>
  );
}

interface RiskScoreCardProps {
  score: number;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export default function RiskScoreCard({ score, label = "Risk Score", size = "md" }: RiskScoreCardProps) {
  const getColor = (s: number) => {
    if (s >= 75) return "text-accent-red";
    if (s >= 40) return "text-accent-yellow";
    return "text-accent-green";
  };

  const getBgGlow = (s: number) => {
    if (s >= 75) return "shadow-accent-red/20";
    if (s >= 40) return "shadow-accent-yellow/20";
    return "shadow-accent-green/20";
  };

  const getLevel = (s: number) => {
    if (s >= 90) return "CRITICAL";
    if (s >= 75) return "HIGH";
    if (s >= 40) return "MEDIUM";
    return "LOW";
  };

  const sizeClasses = {
    sm: "text-2xl w-16 h-16",
    md: "text-4xl w-24 h-24",
    lg: "text-6xl w-32 h-32",
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`${sizeClasses[size]} rounded-full bg-dark-800 border-2 ${
          score >= 75 ? "border-accent-red/50" : score >= 40 ? "border-accent-yellow/50" : "border-accent-green/50"
        } flex items-center justify-center shadow-lg ${getBgGlow(score)}`}
      >
        <span className={`font-bold font-mono ${getColor(score)}`}>{score}</span>
      </div>
      <span className="text-dark-300 text-sm font-medium">{label}</span>
      <span className={`text-xs font-semibold ${getColor(score)}`}>{getLevel(score)}</span>
    </div>
  );
}

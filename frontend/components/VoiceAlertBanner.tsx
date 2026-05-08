import { AlertTriangle, Volume2, VolumeX, X } from "lucide-react";
import { useVoiceAlert } from "../hooks/useVoiceAlert";
import { useAppContext } from "../context/AppContext";
import { useEffect, useState } from "react";

interface VoiceAlertBannerProps {
  riskScore: number;
  reasons: string[];
  recommendation: string;
  onDismiss: () => void;
}

export default function VoiceAlertBanner({ riskScore, reasons, recommendation, onDismiss }: VoiceAlertBannerProps) {
  const { speak, stop, isSpeaking } = useVoiceAlert();
  const { voiceEnabled } = useAppContext();
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    if (riskScore >= 70 && voiceEnabled && !hasPlayed) {
      const warningText =
        riskScore >= 90
          ? "CRITICAL WARNING: This transaction is highly likely malicious. Do NOT proceed. Cancel immediately."
          : "HIGH RISK ALERT: This transaction shows suspicious patterns. Please review carefully before confirming.";

      speak(warningText);
      setHasPlayed(true);
    }
  }, [riskScore, voiceEnabled, hasPlayed, speak]);

  if (riskScore < 40) return null;

  const severityColor = riskScore >= 75 ? "border-accent-red/50 bg-accent-red/10" : "border-accent-yellow/50 bg-accent-yellow/10";
  const iconColor = riskScore >= 75 ? "text-accent-red" : "text-accent-yellow";

  return (
    <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl glass-card ${severityColor} border-2 p-6 animate-pulse-glow`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <AlertTriangle className={`w-8 h-8 ${iconColor} flex-shrink-0`} />
          <div>
            <h3 className={`text-lg font-bold ${iconColor}`}>
              {riskScore >= 90 ? "CRITICAL THREAT DETECTED" : "HIGH RISK TRANSACTION"}
            </h3>
            <p className="text-sm text-dark-300 mt-1">Risk Score: {riskScore}/100</p>
            <ul className="mt-2 space-y-1">
              {reasons.map((reason, i) => (
                <li key={i} className="text-sm text-dark-200 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                  {reason}
                </li>
              ))}
            </ul>
            <p className="text-sm font-medium mt-3 text-white">{recommendation}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => (isSpeaking ? stop() : speak("Warning: Risky transaction detected"))}
            className="p-2 rounded-lg bg-dark-700 hover:bg-dark-600 transition-colors"
            title={isSpeaking ? "Stop voice" : "Play warning"}
          >
            {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <button onClick={onDismiss} className="p-2 rounded-lg bg-dark-700 hover:bg-dark-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Mic, MicOff, Volume2, CheckCircle2, Activity, Shield, AlertCircle } from "lucide-react";

const voiceCommands = [
  { command: "Approve transaction", description: "Approve the pending transaction", category: "Transaction" },
  { command: "Cancel transaction", description: "Reject and cancel the transaction", category: "Transaction" },
  { command: "Check wallet risk", description: "Get current wallet security score", category: "Security" },
  { command: "Show recent activity", description: "Display recent transactions", category: "Info" },
  { command: "Enable voice protection", description: "Turn on voice authentication", category: "Settings" },
  { command: "What are my alerts", description: "List all security alerts", category: "Security" },
];

const recentVoiceActivity = [
  { id: 1, command: "Approve transaction", timestamp: "2 hours ago", status: "success", result: "Transaction to 8xK2...mP9q approved" },
  { id: 2, command: "Check wallet risk", timestamp: "5 hours ago", status: "success", result: "Risk score: 94/100 - Excellent" },
  { id: 3, command: "Cancel transaction", timestamp: "1 day ago", status: "success", result: "Suspicious transaction cancelled" },
];

const tips = [
  "Speak clearly and at a normal pace",
  "Use exact command phrases for best results",
  "Ensure minimal background noise",
  "Wait for confirmation before next command",
];

export default function VoiceSecurity() {
  const [isListening, setIsListening] = useState(false);
  const [currentCommand, setCurrentCommand] = useState("");

  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        const commands = ["Listening...", "Approve...", "Approve transaction", "Processing command...", "Command confirmed"];
        setCurrentCommand(commands[Math.floor(Math.random() * commands.length)]);
      }, 1500);
      return () => clearInterval(interval);
    } else {
      setCurrentCommand("");
    }
  }, [isListening]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Voice Protection</h1>
        <p className="text-muted-foreground">Secure your transactions with voice commands and authentication</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Mic, label: "Voice Protection", value: "Enabled", badge: "Active", badgeColor: "success", color: "neon-purple", border: "neon-purple" },
          { icon: Activity, label: "Commands Used", value: "127", color: "neon-cyan", border: "neon-cyan" },
          { icon: CheckCircle2, label: "Success Rate", value: "99.2%", color: "success", border: "success" },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className={`p-6 rounded-xl bg-card border border-border hover:border-[var(--${s.border})]/50 transition-all`}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--${s.color})]/20 to-[var(--neon-blue)]/20 flex items-center justify-center">
                  <Icon className={`w-5 h-5 text-[var(--${s.color})]`} />
                </div>
                {s.badge && <span className={`px-3 py-1 rounded-full bg-[var(--${s.badgeColor})]/10 text-[var(--${s.badgeColor})] text-xs`}>{s.badge}</span>}
              </div>
              <p className="text-sm text-muted-foreground mb-1">{s.label}</p>
              <h3 className="text-2xl">{s.value}</h3>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 rounded-xl bg-gradient-to-br from-card to-secondary/30 border border-[var(--neon-purple)]/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-purple)]/5 to-[var(--neon-blue)]/5"></div>
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h3 className="mb-2">Voice Command Interface</h3>
                <p className="text-sm text-muted-foreground">{isListening ? "Listening for your command..." : "Click the microphone to start"}</p>
              </div>
              <div className="flex flex-col items-center gap-8">
                <button
                  onClick={() => setIsListening(!isListening)}
                  className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all ${
                    isListening
                      ? "bg-gradient-to-br from-[var(--destructive)] to-[var(--destructive)]/80 shadow-2xl shadow-[var(--destructive)]/40 scale-110"
                      : "bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] shadow-xl shadow-[var(--neon-purple)]/30 hover:scale-105"
                  }`}
                >
                  {isListening ? <MicOff className="w-12 h-12 text-white" /> : <Mic className="w-12 h-12 text-white" />}
                </button>

                {currentCommand && (
                  <div className="px-6 py-3 rounded-lg bg-card border border-[var(--neon-purple)]/50 shadow-lg">
                    <p className="text-center text-[var(--neon-cyan)]">{currentCommand}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                  <div className="p-3 rounded-lg bg-secondary/50 border border-border text-center">
                    <Volume2 className="w-5 h-5 text-[var(--neon-cyan)] mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Voice Quality</p>
                    <p className="text-sm">Excellent</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50 border border-border text-center">
                    <Shield className="w-5 h-5 text-[var(--success)] mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Authentication</p>
                    <p className="text-sm text-[var(--success)]">Verified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-card border border-border">
            <h3 className="mb-4">Recent Voice Activity</h3>
            <div className="space-y-3">
              {recentVoiceActivity.map((a) => (
                <div key={a.id} className="p-4 rounded-lg bg-secondary/50 border border-border hover:border-[var(--neon-purple)]/30 transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[var(--success)]/10 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
                      </div>
                      <div>
                        <h4 className="mb-1">"{a.command}"</h4>
                        <p className="text-sm text-muted-foreground">{a.result}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{a.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-card border border-border">
            <h3 className="mb-4">Available Commands</h3>
            <div className="space-y-2">
              {voiceCommands.map((cmd, i) => (
                <div key={i} className="p-3 rounded-lg bg-secondary/50 border border-border hover:border-[var(--neon-purple)]/30 transition-all group cursor-pointer">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="group-hover:text-[var(--neon-purple)] transition-colors">"{cmd.command}"</h4>
                    <span className="text-xs px-2 py-0.5 rounded bg-[var(--neon-purple)]/10 text-[var(--neon-purple)]">{cmd.category}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{cmd.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-[var(--neon-blue)]/10 to-[var(--neon-purple)]/10 border border-[var(--neon-blue)]/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--neon-blue)] to-[var(--neon-purple)] flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div><h4>Voice Tips</h4><p className="text-xs text-muted-foreground">Best practices</p></div>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground">
              {tips.map((t, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--neon-cyan)] mt-0.5 flex-shrink-0" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Bell, Shield, Mic, Mail, Lock, CheckCircle2, Save } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useState } from "react";

function ToggleSwitch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={label}
      />
      <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[var(--neon-purple)] peer-checked:to-[var(--neon-blue)]"></div>
    </label>
  );
}

export default function Settings() {
  const { settings, updateSetting, stats } = useAppContext();
  const [notification, setNotification] = useState<string | null>(null);

  const handleChange = (key: keyof typeof settings, value: boolean) => {
    updateSetting(key, value);
    setNotification("Settings saved");
    setTimeout(() => setNotification(null), 2000);
  };

  const securityToggles = [
    { key: "voiceAuth" as const, icon: Mic, title: "Voice Authentication", desc: "Require voice confirmation for transactions", color: "neon-purple" },
    { key: "aiScamDetection" as const, icon: Shield, title: "AI Scam Detection", desc: "Automatically scan all transactions for risks", color: "neon-cyan" },
    { key: "autoBlockHighRisk" as const, icon: Lock, title: "Auto-block High Risk", desc: "Automatically reject transactions above 70 risk score", color: "warning" },
  ];

  const notificationToggles = [
    { key: "transactionAlerts" as const, icon: Bell, title: "Transaction Alerts", desc: "Notify me of all transactions", color: "neon-purple" },
    { key: "securityWarnings" as const, icon: Bell, title: "Security Warnings", desc: "Alert me of high-risk transactions", color: "destructive" },
    { key: "emailNotifications" as const, icon: Mail, title: "Email Notifications", desc: "Send alerts to my email", color: "neon-cyan" },
  ];

  return (
    <div className="space-y-6">
      {notification && (
        <div className="fixed top-20 right-6 z-50 px-6 py-3 rounded-lg shadow-lg bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/30 flex items-center gap-2">
          <Save className="w-5 h-5" />
          {notification}
        </div>
      )}

      <div>
        <h1 className="mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your VoiceChain security preferences and account settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-card border border-border">
          <h3 className="mb-6">Security Preferences</h3>
          <div className="space-y-4">
            {securityToggles.map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.key} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--${t.color})]/20 to-[var(--neon-blue)]/20 flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 text-[var(--${t.color})]`} />
                    </div>
                    <div>
                      <h4>{t.title}</h4>
                      <p className="text-sm text-muted-foreground">{t.desc}</p>
                    </div>
                  </div>
                  <ToggleSwitch
                    checked={settings[t.key]}
                    onChange={(v) => handleChange(t.key, v)}
                    label={t.title}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 rounded-xl bg-card border border-border">
          <h3 className="mb-6">Notification Settings</h3>
          <div className="space-y-4">
            {notificationToggles.map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.key} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--${t.color})]/20 to-[var(--neon-blue)]/20 flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 text-[var(--${t.color})]`} />
                    </div>
                    <div>
                      <h4>{t.title}</h4>
                      <p className="text-sm text-muted-foreground">{t.desc}</p>
                    </div>
                  </div>
                  <ToggleSwitch
                    checked={settings[t.key]}
                    onChange={(v) => handleChange(t.key, v)}
                    label={t.title}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-card border border-border">
        <h3 className="mb-6">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-gradient-to-br from-[var(--neon-purple)]/10 to-[var(--neon-blue)]/10 border border-[var(--neon-purple)]/30">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
              <span className="text-sm">Local Storage</span>
            </div>
            <p className="text-xs text-muted-foreground">Settings and data persist between sessions</p>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-[var(--neon-cyan)]/10 to-[var(--neon-blue)]/10 border border-[var(--neon-cyan)]/30">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
              <span className="text-sm">State Management</span>
            </div>
            <p className="text-xs text-muted-foreground">All page states connected to AppContext</p>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-[var(--success)]/10 to-[var(--neon-cyan)]/10 border border-[var(--success)]/30">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
              <span className="text-sm">MVP Ready</span>
            </div>
            <p className="text-xs text-muted-foreground">All core interactions are functional</p>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-gradient-to-br from-[var(--neon-blue)]/10 to-[var(--neon-purple)]/10 border border-[var(--neon-blue)]/30">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--neon-blue)] to-[var(--neon-purple)] flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="mb-2">About VoiceChain Security</h4>
            <p className="text-sm text-muted-foreground mb-4">
              VoiceChain uses advanced AI algorithms and voice biometrics to provide multi-layered security for your blockchain transactions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Platform", value: "VoiceChain v1.0" },
                { label: "Transactions Processed", value: String(stats.totalScanned) },
                { label: "Data Storage", value: "Local + API" },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-lg bg-card/50 border border-border">
                  <p className="text-sm mb-1">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

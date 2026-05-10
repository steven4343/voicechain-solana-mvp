import Link from "next/link";
import { Shield, Activity, Mic, GraduationCap, Bot, CheckCircle2 } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI Risk Analysis",
    description: "Every transaction is analyzed by AI before confirmation. Get real-time risk scores and detailed explanations of potential threats.",
  },
  {
    icon: Mic,
    title: "Voice Security Alerts",
    description: "When a risky transaction is detected, VoiceChain generates spoken warnings using ElevenLabs TTS technology.",
  },
  {
    icon: GraduationCap,
    title: "Blockchain Scholarships",
    description: "Milestone-based scholarship management on Solana with committee voting and transparent fund distribution.",
  },
  {
    icon: Activity,
    title: "Security Analytics",
    description: "Comprehensive dashboard showing risk score history, transaction patterns, and blocked threats over time.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] flex items-center justify-center shadow-lg shadow-[var(--neon-purple)]/30">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-white">VoiceChain</h1>
          </div>
          <nav className="flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
            <Link href="/dashboard" className="px-5 py-2 rounded-lg bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] text-white hover:shadow-lg hover:shadow-[var(--neon-purple)]/30 transition-all">Launch App</Link>
          </nav>
        </div>
      </header>

      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-[var(--neon-purple)]/30 text-sm text-[var(--neon-purple)] mb-4">
              <span className="w-2 h-2 rounded-full bg-[var(--neon-purple)] animate-pulse"></span>
              Powered by Solana Blockchain
            </div>
            <h1 className="text-6xl max-w-4xl mx-auto tracking-tight bg-gradient-to-r from-white via-[var(--neon-purple)] to-[var(--neon-cyan)] bg-clip-text text-transparent">
              Secure Blockchain Transactions with AI Voice Protection
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              VoiceChain protects Solana users from malicious transactions using AI-powered risk analysis and real-time voice alerts. Manage blockchain-based scholarships with milestone approvals.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <Link href="/dashboard" className="px-8 py-4 rounded-lg bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] text-white shadow-lg shadow-[var(--neon-purple)]/40 text-base hover:shadow-xl hover:shadow-[var(--neon-purple)]/50 transition-all">Launch App</Link>
              <a href="#features" className="px-8 py-4 rounded-lg bg-secondary border border-border text-foreground hover:bg-secondary/80 transition-all">Learn More</a>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-6 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">Enterprise-Grade Security</h2>
            <p className="text-muted-foreground text-lg">AI-powered protection for your Solana transactions</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <div key={i} className="p-6 rounded-xl bg-card border border-border hover:border-[var(--neon-purple)]/50 transition-all group hover:shadow-lg hover:shadow-[var(--neon-purple)]/10">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--neon-purple)]/20 to-[var(--neon-blue)]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6 text-[var(--neon-purple)]" />
                </div>
                <h3 className="mb-2">{f.title}</h3>
                <p className="text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">Three steps to secure your Solana transactions</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: "1", title: "Connect Wallet", desc: "Connect your Phantom or Solflare wallet to enable transaction monitoring" },
              { num: "2", title: "AI Analyzes Risk", desc: "Every transaction is simulated and analyzed by our AI risk engine before confirmation" },
              { num: "3", title: "Voice Alerts + Protection", desc: "High-risk transactions trigger spoken warnings and auto-blocking" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[var(--neon-purple)]/30">
                  <span className="text-2xl text-white">{s.num}</span>
                </div>
                <h3 className="mb-2">{s.title}</h3>
                <p className="text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-r from-[var(--neon-purple)]/10 to-[var(--neon-blue)]/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl mb-6">Ready to Secure Your Transactions?</h2>
          <p className="text-xl text-muted-foreground mb-8">Launch VoiceChain and protect your transactions</p>
          <Link href="/dashboard" className="inline-block px-8 py-4 rounded-lg bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] text-white shadow-xl shadow-[var(--neon-purple)]/40 text-base hover:shadow-2xl transition-all">Launch App</Link>
          <div className="flex items-center justify-center gap-8 mt-12 text-sm text-muted-foreground">
            {["AI-Powered Analysis", "Real-Time Voice Alerts", "On-Chain Scholarships"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm text-muted-foreground">© 2026 VoiceChain. Built on Solana.</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              {["Privacy", "Terms", "GitHub"].map((l) => (
                <a key={l} href="#" className="hover:text-foreground transition-colors">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

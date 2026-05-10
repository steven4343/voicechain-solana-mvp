import Link from "next/link";
import { useRouter } from "next/router";
import { LayoutDashboard, GraduationCap, Shield, Mic, BarChart3, Settings, Bell, Users, LogOut, User } from "lucide-react";
import { ReactNode, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/communities", label: "Communities", icon: Users },
  { href: "/scholarships", label: "Scholarships", icon: GraduationCap },
  { href: "/transactions", label: "Transactions", icon: Shield },
  { href: "/voice", label: "Voice Security", icon: Mic },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { publicKey } = useWallet();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col flex-shrink-0">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white tracking-tight">VoiceChain</h1>
              <p className="text-xs text-muted-foreground">Security Platform</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = router.pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-[var(--neon-purple)]/20"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : ""}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-2">
          <div className="px-3 py-2 rounded-lg bg-sidebar-accent/50 border border-[var(--neon-purple)]/30">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Network</span>
              <span className="text-xs text-[var(--neon-cyan)]">● Solana Devnet</span>
            </div>
            <p className="text-sm text-foreground">
              {publicKey ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}` : "Wallet disconnected"}
            </p>
          </div>
          {user && (
            <button onClick={logout}
              className="w-full px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all flex items-center gap-2">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          )}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 flex-shrink-0">
          <h2 className="text-foreground">Secure Blockchain Transactions</h2>

          <div className="flex items-center gap-4">
            {user && (
              <div className="relative">
                <button onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] flex items-center justify-center text-xs text-white">
                    {user.displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-foreground">{user.displayName}</span>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 p-2 rounded-xl bg-card border border-border shadow-xl z-50">
                    <div className="px-3 py-2 border-b border-border mb-2">
                      <p className="text-sm font-medium">{user.displayName}</p>
                      <p className="text-xs text-muted-foreground break-all">{user.walletAddress}</p>
                    </div>
                    <button onClick={() => { logout(); router.push("/login"); }}
                      className="w-full px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all flex items-center gap-2">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
            <WalletMultiButton className="!bg-gradient-to-r !from-[var(--neon-purple)] !to-[var(--neon-blue)] !text-white !rounded-lg !px-4 !py-2 !h-auto !text-sm" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

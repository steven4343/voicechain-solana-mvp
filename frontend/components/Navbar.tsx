import Link from "next/link";
import { useRouter } from "next/router";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Shield, BarChart3, BookOpen, Home } from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/", icon: Home },
  { label: "Scholarships", path: "/scholarships", icon: BookOpen },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
];

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-950/80 backdrop-blur-xl border-b border-dark-700/50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-cyan bg-clip-text text-transparent">
              VoiceChain
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = router.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary-500/20 text-primary-400"
                      : "text-dark-300 hover:text-white hover:bg-dark-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <WalletMultiButton className="!bg-primary-600 hover:!bg-primary-500 !text-white !font-semibold !px-5 !py-2.5 !rounded-xl !transition-all" />
        </div>
      </div>
    </nav>
  );
}

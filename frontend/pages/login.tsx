import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Shield, Wallet, User, LogIn, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { publicKey, connected } = useWallet();
  const { login, isAuthenticated, loading } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, loading, router]);

  const handleLogin = async () => {
    if (!publicKey) return;
    setLoggingIn(true);
    setError(null);
    try {
      await login(publicKey.toBase58(), displayName.trim() || undefined);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoggingIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--neon-purple)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] flex items-center justify-center shadow-lg shadow-[var(--neon-purple)]/30">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl text-white">VoiceChain</h1>
          </Link>
          <h2 className="text-3xl mb-2">Welcome Back</h2>
          <p className="text-muted-foreground">Connect your wallet to access the platform</p>
        </div>

        <div className="p-8 rounded-xl bg-card border border-border space-y-6">
          <div className="flex justify-center">
            <WalletMultiButton className="!bg-gradient-to-r !from-[var(--neon-purple)] !to-[var(--neon-blue)] !text-white !rounded-lg !px-6 !py-3 !h-auto !text-base" />
          </div>

          {connected && publicKey && (
            <>
              <div className="p-4 rounded-lg bg-[var(--success)]/5 border border-[var(--success)]/20">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[var(--success)]" />
                  <div>
                    <p className="text-sm text-[var(--success)]">Wallet Connected</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{publicKey.toBase58().slice(0, 8)}...{publicKey.toBase58().slice(-8)}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Display Name (optional)</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your name"
                    maxLength={30}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[var(--neon-purple)]"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-sm text-destructive">{error}</div>
              )}

              <button
                onClick={handleLogin}
                disabled={loggingIn}
                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] text-white hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-base"
              >
                {loggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
                {loggingIn ? "Signing in..." : "Sign In with Solana"}
              </button>
            </>
          )}

          {!connected && (
            <div className="text-center py-4">
              <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Connect your Phantom or Solflare wallet to continue</p>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1">
            Back to Home <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
const AUTH_KEY = "voicechain_auth";

interface AuthUser {
  walletAddress: string;
  displayName: string;
  createdAt: number;
  lastLogin: number;
  totalDonations: number;
  communitiesJoined: string[];
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (walletAddress: string, displayName?: string) => Promise<void>;
  logout: () => void;
  updateDisplayName: (name: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

function loadAuth(): { user: AuthUser | null; token: string | null } {
  if (typeof window === "undefined") return { user: null, token: null };
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { user: null, token: null };
}

function saveAuth(data: { user: AuthUser; token: string }) {
  try { localStorage.setItem(AUTH_KEY, JSON.stringify(data)); } catch {}
}

function clearAuth() {
  try { localStorage.removeItem(AUTH_KEY); } catch {}
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = loadAuth();
    if (saved.token && saved.user) {
      setToken(saved.token);
      setUser(saved.user);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (walletAddress: string, displayName?: string) => {
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress, displayName }),
    });
    if (!res.ok) throw new Error("Login failed");
    const data = await res.json();
    setUser(data.user);
    setToken(data.token);
    saveAuth(data);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    clearAuth();
  }, []);

  const updateDisplayName = useCallback(async (name: string) => {
    if (!token) return;
    const res = await fetch(`${BACKEND_URL}/api/auth/profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ displayName: name }),
    });
    if (!res.ok) throw new Error("Failed to update profile");
    const updated = await res.json();
    setUser(updated);
    if (token) saveAuth({ user: updated, token });
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user && !!token, login, logout, updateDisplayName, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

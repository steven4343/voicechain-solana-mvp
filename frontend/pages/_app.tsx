import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { AppProvider } from "../context/AppContext";
import { AuthProvider } from "../context/AuthContext";
import { WalletContextProvider } from "../context/WalletContext";
import DashboardLayout from "../components/DashboardLayout";
import "../styles/globals.css";

function AuthGuard({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isLanding = router.pathname === "/";
  const isLogin = router.pathname === "/login";

  if (isLanding || isLogin) {
    return (
      <WalletContextProvider>
        <AuthProvider>
          <AppProvider>
            <AuthGuard>
              <Component {...pageProps} />
            </AuthGuard>
          </AppProvider>
        </AuthProvider>
      </WalletContextProvider>
    );
  }

  return (
    <WalletContextProvider>
      <AuthProvider>
        <AppProvider>
          <AuthGuard>
            <DashboardLayout>
              <Component {...pageProps} />
            </DashboardLayout>
          </AuthGuard>
        </AppProvider>
      </AuthProvider>
    </WalletContextProvider>
  );
}

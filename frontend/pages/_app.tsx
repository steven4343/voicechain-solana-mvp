import type { AppProps } from "next/app";
import WalletContextProvider from "../wallet/WalletContextProvider";
import { AppProvider } from "../context/AppContext";
import Navbar from "../components/Navbar";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WalletContextProvider>
      <AppProvider>
        <div className="min-h-screen">
          <Navbar />
          <main className="pt-20 pb-10 px-6 max-w-7xl mx-auto">
            <Component {...pageProps} />
          </main>
        </div>
      </AppProvider>
    </WalletContextProvider>
  );
}

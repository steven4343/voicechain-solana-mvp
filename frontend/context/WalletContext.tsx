import { FC, ReactNode, useMemo, useEffect, useState } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";

import "@solana/wallet-adapter-react-ui/styles.css";
import { checkConnectionHealth } from "../lib/solana";

function resolveEndpoint(): string {
  const envRpc = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
  if (envRpc) return envRpc;

  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet";
  const clusterUrls: Record<string, string> = {
    "mainnet-beta": "https://api.mainnet-beta.solana.com",
    devnet: "https://api.devnet.solana.com",
    testnet: "https://api.testnet.solana.com",
  };
  return clusterUrls[network] || clusterUrls.devnet;
}

const endpoint = resolveEndpoint();

export const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [connectionReady, setConnectionReady] = useState(false);

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const health = await checkConnectionHealth();
      if (mounted) {
        if (!health.ok) {
          console.warn("Solana connection health check failed:", health.error);
        }
        setConnectionReady(true);
      }
    };
    init();
    return () => { mounted = false; };
  }, []);

  if (!connectionReady) {
    return <>{children}</>;
  }

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

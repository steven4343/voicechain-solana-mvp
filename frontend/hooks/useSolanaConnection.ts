import { useState, useEffect, useCallback } from "react";
import { checkConnectionHealth, getConnection, SolanaNetwork } from "../lib/solana";

interface ConnectionStatus {
  connected: boolean;
  slot: number | null;
  blockHeight: number | null;
  error: string | null;
  lastChecked: number | null;
  checking: boolean;
  network: SolanaNetwork;
}

export function useSolanaConnection(network?: SolanaNetwork) {
  const [status, setStatus] = useState<ConnectionStatus>({
    connected: false,
    slot: null,
    blockHeight: null,
    error: null,
    lastChecked: null,
    checking: false,
    network: network || "devnet",
  });

  const check = useCallback(async () => {
    setStatus((prev) => ({ ...prev, checking: true }));
    const result = await checkConnectionHealth();
    setStatus({
      connected: result.ok,
      slot: result.slot ?? null,
      blockHeight: result.blockHeight ?? null,
      error: result.error ?? null,
      lastChecked: Date.now(),
      checking: false,
      network: network || "devnet",
    });
  }, [network]);

  useEffect(() => {
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, [check]);

  return {
    ...status,
    refresh: check,
    connection: getConnection(),
  };
}

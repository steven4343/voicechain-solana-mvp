import {
  Connection,
  clusterApiUrl,
  Commitment,
  PublicKey,
  TransactionSignature,
  Blockhash,
  Transaction,
  SendOptions,
  SimulatedTransactionResponse,
  VersionedTransaction,
} from "@solana/web3.js";

export type SolanaNetwork = "mainnet-beta" | "testnet" | "devnet";

export interface SolanaConnectionConfig {
  endpoint?: string;
  network?: SolanaNetwork;
  commitment?: Commitment;
  confirmTransactionInitialTimeout?: number;
  wsEndpoint?: string;
  disableRetryOnRateLimit?: boolean;
}

const DEFAULT_CONFIG: SolanaConnectionConfig = {
  network: "devnet",
  commitment: "confirmed",
  confirmTransactionInitialTimeout: 60000,
};

let connectionInstance: Connection | null = null;

function resolveEndpoint(config: SolanaConnectionConfig): string {
  if (config.endpoint) return config.endpoint;
  const network = config.network || DEFAULT_CONFIG.network!;
  try {
    return clusterApiUrl(network);
  } catch {
    return "https://api.devnet.solana.com";
  }
}

export function getConnection(config?: SolanaConnectionConfig): Connection {
  if (connectionInstance && !config) {
    return connectionInstance;
  }

  const resolved: SolanaConnectionConfig = { ...DEFAULT_CONFIG, ...config };
  const endpoint = resolveEndpoint(resolved);

  connectionInstance = new Connection(endpoint, {
    commitment: resolved.commitment || "confirmed",
    confirmTransactionInitialTimeout: resolved.confirmTransactionInitialTimeout ?? 60000,
    wsEndpoint: resolved.wsEndpoint,
    disableRetryOnRateLimit: resolved.disableRetryOnRateLimit ?? false,
  });

  return connectionInstance;
}

export function resetConnection(): void {
  connectionInstance = null;
}

export function getExplorerUrl(signatureOrAddress: string, network?: SolanaNetwork): string {
  const base = network || DEFAULT_CONFIG.network || "devnet";
  const clusterParam = base === "mainnet-beta" ? "" : `?cluster=${base}`;
  return `https://explorer.solana.com/tx/${signatureOrAddress}${clusterParam}`;
}

export async function getBalance(
  publicKey: PublicKey,
  commitment?: Commitment
): Promise<number> {
  const connection = getConnection();
  return connection.getBalance(publicKey, commitment);
}

export async function getLatestBlockhash(
  commitment?: Commitment
): Promise<{ blockhash: Blockhash; lastValidBlockHeight: number }> {
  const connection = getConnection();
  return connection.getLatestBlockhash(commitment || "confirmed");
}

export async function confirmTransaction(
  signature: TransactionSignature,
  commitment?: Commitment
) {
  const connection = getConnection();
  const latestBlockhash = await getLatestBlockhash(commitment);
  return connection.confirmTransaction(
    {
      signature,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    },
    commitment || "confirmed"
  );
}

export async function getTransactionDetails(signature: string) {
  const connection = getConnection();
  return connection.getTransaction(signature, {
    commitment: "confirmed",
    maxSupportedTransactionVersion: 0,
  });
}

export async function getSignaturesForAddress(
  address: PublicKey,
  limit: number = 10
) {
  const connection = getConnection();
  return connection.getSignaturesForAddress(address, { limit });
}

export async function simulateTransaction(
  transaction: Transaction | VersionedTransaction
): Promise<SimulatedTransactionResponse> {
  const connection = getConnection();
  return connection.simulateTransaction(transaction);
}

export async function sendTransaction(
  transaction: Transaction | VersionedTransaction,
  sendOptions?: SendOptions
): Promise<TransactionSignature> {
  const connection = getConnection();
  return connection.sendTransaction(transaction, sendOptions);
}

export async function getTokenBalance(
  tokenAccount: PublicKey,
  commitment?: Commitment
) {
  const connection = getConnection();
  return connection.getTokenAccountBalance(tokenAccount, commitment);
}

export async function getMinimumBalanceForRentExemption(
  dataSize: number,
  commitment?: Commitment
): Promise<number> {
  const connection = getConnection();
  return connection.getMinimumBalanceForRentExemption(dataSize, commitment);
}

export async function checkConnectionHealth(): Promise<{
  ok: boolean;
  slot?: number;
  blockHeight?: number;
  error?: string;
}> {
  try {
    const connection = getConnection();
    const version = await connection.getVersion();
    const slot = await connection.getSlot();
    const blockHeight = await connection.getBlockHeight();
    return { ok: true, slot, blockHeight };
  } catch (error: any) {
    return { ok: false, error: error?.message || "Connection failed" };
  }
}

export function parseNetworkFromEnv(): SolanaNetwork {
  if (typeof process === "undefined" || !process.env) return "devnet";
  const env = process.env.NEXT_PUBLIC_SOLANA_NETWORK;
  if (env === "mainnet-beta" || env === "testnet" || env === "devnet") return env;
  return "devnet";
}

export function getConnectionFromEnv(): Connection {
  const network = parseNetworkFromEnv();
  const rpcUrl = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_SOLANA_RPC_URL : undefined;
  return getConnection({ endpoint: rpcUrl, network });
}

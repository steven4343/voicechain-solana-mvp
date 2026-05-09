const { Connection, PublicKey, LAMPORTS_PER_SOL, clusterApiUrl } = require("@solana/web3.js");
const { config } = require("../config");

let connectionInstance = null;

const DEFAULT_COMMITMENT = "confirmed";
const DEFAULT_TIMEOUT = 60000;

function createConnection() {
  const { rpcUrl, commitment, confirmTimeout, wsEndpoint } = config.solana;

  const endpoint = rpcUrl || clusterApiUrl("devnet");

  return new Connection(endpoint, {
    commitment: commitment || DEFAULT_COMMITMENT,
    confirmTransactionInitialTimeout: confirmTimeout || DEFAULT_TIMEOUT,
    wsEndpoint: wsEndpoint || undefined,
  });
}

function getConnection() {
  if (!connectionInstance) {
    connectionInstance = createConnection();
  }
  return connectionInstance;
}

function resetConnection() {
  connectionInstance = null;
}

async function checkHealth() {
  try {
    const connection = getConnection();
    const [version, slot, blockHeight] = await Promise.all([
      connection.getVersion(),
      connection.getSlot(),
      connection.getBlockHeight(),
    ]);
    return {
      ok: true,
      version: version["solana-core"],
      slot,
      blockHeight,
      endpoint: config.solana.rpcUrl || clusterApiUrl("devnet"),
    };
  } catch (error) {
    return {
      ok: false,
      error: error.message,
      endpoint: config.solana.rpcUrl || clusterApiUrl("devnet"),
    };
  }
}

async function getBalance(address) {
  try {
    const pubkey = new PublicKey(address);
    const connection = getConnection();
    const balance = await connection.getBalance(pubkey);
    return {
      lamports: balance,
      sol: balance / LAMPORTS_PER_SOL,
    };
  } catch (error) {
    throw new Error(`Failed to get balance: ${error.message}`);
  }
}

async function getLatestBlockhash() {
  try {
    const connection = getConnection();
    return connection.getLatestBlockhash();
  } catch (error) {
    throw new Error(`Failed to get latest blockhash: ${error.message}`);
  }
}

async function confirmTransaction(signature, commitment) {
  try {
    const connection = getConnection();
    const latestBlockhash = await getLatestBlockhash();
    return connection.confirmTransaction(
      {
        signature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      },
      commitment || DEFAULT_COMMITMENT
    );
  } catch (error) {
    throw new Error(`Failed to confirm transaction: ${error.message}`);
  }
}

async function getTransaction(signature) {
  try {
    const connection = getConnection();
    return connection.getTransaction(signature, {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0,
    });
  } catch (error) {
    throw new Error(`Failed to get transaction: ${error.message}`);
  }
}

async function getSignaturesForAddress(address, limit = 10, before = undefined, until = undefined) {
  try {
    const pubkey = new PublicKey(address);
    const connection = getConnection();
    return connection.getSignaturesForAddress(pubkey, { limit, before, until });
  } catch (error) {
    throw new Error(`Failed to get signatures: ${error.message}`);
  }
}

async function requestAirdrop(address, amountInSol) {
  try {
    const pubkey = new PublicKey(address);
    const connection = getConnection();
    const signature = await connection.requestAirdrop(pubkey, amountInSol * LAMPORTS_PER_SOL);
    await confirmTransaction(signature);
    return { signature, amount: amountInSol };
  } catch (error) {
    throw new Error(`Airdrop failed: ${error.message}`);
  }
}

async function getAccountInfo(address) {
  try {
    const pubkey = new PublicKey(address);
    const connection = getConnection();
    return connection.getAccountInfo(pubkey);
  } catch (error) {
    throw new Error(`Failed to get account info: ${error.message}`);
  }
}

async function getTokenAccountsByOwner(address) {
  try {
    const pubkey = new PublicKey(address);
    const connection = getConnection();
    return connection.getParsedTokenAccountsByOwner(pubkey, { programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") });
  } catch (error) {
    throw new Error(`Failed to get token accounts: ${error.message}`);
  }
}

async function getSlot() {
  const connection = getConnection();
  return connection.getSlot();
}

async function getEpochInfo() {
  const connection = getConnection();
  return connection.getEpochInfo();
}

module.exports = {
  getConnection,
  resetConnection,
  checkHealth,
  getBalance,
  getLatestBlockhash,
  confirmTransaction,
  getTransaction,
  getSignaturesForAddress,
  requestAirdrop,
  getAccountInfo,
  getTokenAccountsByOwner,
  getSlot,
  getEpochInfo,
  LAMPORTS_PER_SOL,
};

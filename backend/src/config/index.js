require("dotenv").config();

const SOLANA_NETWORKS = {
  MAINNET: "mainnet-beta",
  DEVNET: "devnet",
  TESTNET: "testnet",
};

function resolveRpcUrl() {
  if (process.env.SOLANA_RPC_URL) return process.env.SOLANA_RPC_URL;

  const network = process.env.SOLANA_NETWORK || "devnet";
  const clusterUrls = {
    "mainnet-beta": "https://api.mainnet-beta.solana.com",
    devnet: "https://api.devnet.solana.com",
    testnet: "https://api.testnet.solana.com",
  };
  return clusterUrls[network] || clusterUrls.devnet;
}

const config = {
  port: parseInt(process.env.PORT || "3001"),
  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY,
    baseUrl: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
    model: process.env.AI_MODEL || "mistralai/mistral-7b-instruct",
  },
  solana: {
    rpcUrl: resolveRpcUrl(),
    network: process.env.SOLANA_NETWORK || "devnet",
    commitment: process.env.SOLANA_COMMITMENT || "confirmed",
    confirmTimeout: parseInt(process.env.SOLANA_CONFIRM_TIMEOUT || "60000"),
    wsEndpoint: process.env.SOLANA_WS_URL || undefined,
  },
  elevenlabs: {
    apiKey: process.env.ELEVENLABS_API_KEY,
    model: process.env.ELEVENLABS_MODEL || "eleven_flash_v2_5",
    voiceId: process.env.ELEVENLABS_VOICE_ID || "pNInz6obpgDQGcFmaJgB",
  },
  app: {
    url: process.env.APP_URL || "http://localhost:3000",
  },
};

module.exports = { config, SOLANA_NETWORKS };

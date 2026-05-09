require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { analyzeTransactionRisk } = require("./ai-risk-engine/analyzer");
const solanaService = require("./src/services/solana");
const { config } = require("./src/config");

const app = express();
const PORT = config.port;

app.use(cors());
app.use(express.json());

app.get("/health", async (req, res) => {
  const health = await solanaService.checkHealth();
  res.json({
    status: health.ok ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    solana: health,
  });
});

app.post("/api/risk/analyze", async (req, res) => {
  try {
    const { transactionData, walletAddress } = req.body;

    if (!transactionData) {
      return res.status(400).json({ error: "transactionData is required" });
    }

    const result = await analyzeTransactionRisk(transactionData, walletAddress);
    res.json(result);
  } catch (error) {
    console.error("Risk analysis error:", error);
    res.status(500).json({ error: "Failed to analyze transaction", details: error.message });
  }
});

app.post("/api/risk/voice-warning", async (req, res) => {
  try {
    const { riskScore, details } = req.body;

    if (!riskScore || riskScore < 70) {
      return res.status(400).json({ error: "Only high risk transactions trigger voice warnings" });
    }

    const warning = generateVoiceWarning(riskScore, details);
    res.json({ message: warning, shouldPlay: true });
  } catch (error) {
    console.error("Voice warning error:", error);
    res.status(500).json({ error: "Failed to generate voice warning" });
  }
});

function generateVoiceWarning(riskScore, details) {
  if (riskScore >= 90) {
    return "CRITICAL WARNING: This transaction is highly likely malicious. Do NOT proceed. Cancel immediately.";
  }
  if (riskScore >= 75) {
    return "HIGH RISK ALERT: This transaction shows suspicious patterns. Please review carefully before confirming.";
  }
  return "WARNING: This transaction may be malicious. Exercise caution and verify all details before proceeding.";
}

app.get("/api/analytics/risk-history", (req, res) => {
  const mockHistory = [
    { timestamp: Date.now() - 3600000 * 24 * 7, score: 15 },
    { timestamp: Date.now() - 3600000 * 24 * 6, score: 45 },
    { timestamp: Date.now() - 3600000 * 24 * 5, score: 82 },
    { timestamp: Date.now() - 3600000 * 24 * 4, score: 23 },
    { timestamp: Date.now() - 3600000 * 24 * 3, score: 91 },
    { timestamp: Date.now() - 3600000 * 24 * 2, score: 34 },
    { timestamp: Date.now() - 3600000 * 24 * 1, score: 12 },
    { timestamp: Date.now(), score: 28 },
  ];
  res.json({ history: mockHistory });
});

app.get("/api/analytics/summary", (req, res) => {
  res.json({
    totalTransactions: 247,
    blockedTransactions: 23,
    averageRiskScore: 34,
    highRiskDetected: 12,
    protectedAmount: "145.5 SOL",
  });
});

app.get("/api/solana/health", async (req, res) => {
  const health = await solanaService.checkHealth();
  res.json(health);
});

app.get("/api/solana/balance/:address", async (req, res) => {
  try {
    const balance = await solanaService.getBalance(req.params.address);
    res.json(balance);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/solana/transaction/:signature", async (req, res) => {
  try {
    const tx = await solanaService.getTransaction(req.params.signature);
    if (!tx) return res.status(404).json({ error: "Transaction not found" });
    res.json(tx);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/solana/account/:address", async (req, res) => {
  try {
    const info = await solanaService.getAccountInfo(req.params.address);
    res.json({ exists: !!info, data: info });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/solana/airdrop", async (req, res) => {
  try {
    const { address, amount } = req.body;
    if (!address || !amount) {
      return res.status(400).json({ error: "address and amount are required" });
    }
    const result = await solanaService.requestAirdrop(address, amount);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/solana/slot", async (req, res) => {
  const slot = await solanaService.getSlot();
  res.json({ slot });
});

app.get("/api/solana/epoch", async (req, res) => {
  const epoch = await solanaService.getEpochInfo();
  res.json(epoch);
});

app.get("/api/solana/signatures/:address", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const sigs = await solanaService.getSignaturesForAddress(req.params.address, limit);
    res.json({ signatures: sigs });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`VoiceChain backend running on port ${PORT}`);
  console.log(`Solana network: ${config.solana.network} @ ${config.solana.rpcUrl}`);
});

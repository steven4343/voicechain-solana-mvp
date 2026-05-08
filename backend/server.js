require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { analyzeTransactionRisk } = require("./ai-risk-engine/analyzer");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
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

app.listen(PORT, () => {
  console.log(`VoiceChain backend running on port ${PORT}`);
});

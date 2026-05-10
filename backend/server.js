require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { analyzeTransactionRisk } = require("./ai-risk-engine/analyzer");
const solanaService = require("./src/services/solana");
const elevenlabs = require("./src/services/elevenlabs");
const realData = require("./src/services/realData");
const communityService = require("./src/services/community");
const authService = require("./src/services/auth");
const { config } = require("./src/config");

const app = express();
const PORT = config.port;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/health", async (req, res) => {
  const solanaHealth = await solanaService.checkHealth();
  const elevenlabsReady = !!config.elevenlabs.apiKey;
  res.json({
    status: solanaHealth.ok ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    services: {
      solana: solanaHealth,
      elevenlabs: { configured: elevenlabsReady },
    },
  });
});

app.post("/api/risk/analyze", async (req, res) => {
  try {
    const { transactionData, walletAddress } = req.body;

    if (!transactionData) {
      return res.status(400).json({ error: "transactionData is required" });
    }

    const result = await analyzeTransactionRisk(transactionData, walletAddress);

    const warningText = elevenlabs.buildWarningText(result.riskScore, {
      reason: result.reasons?.[0],
    });

    res.json({ ...result, warningText });
  } catch (error) {
    console.error("Risk analysis error:", error);
    res.status(500).json({ error: "Failed to analyze transaction", details: error.message });
  }
});

app.post("/api/tts/generate", async (req, res) => {
  try {
    const { text, severity, model, voiceId } = req.body;
    if (!text) return res.status(400).json({ error: "text is required" });

    const audioRes = await elevenlabs.generateSpeech(text, {
      severity: severity || "high",
      model,
      voiceId,
    });

    const audioBuffer = Buffer.from(await audioRes.arrayBuffer());
    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": audioBuffer.length.toString(),
    });
    res.send(audioBuffer);
  } catch (error) {
    console.error("TTS error:", error);
    res.status(500).json({ error: "TTS generation failed", details: error.message });
  }
});

app.post("/api/tts/stream", async (req, res) => {
  try {
    const { text, severity, model, voiceId } = req.body;
    if (!text) return res.status(400).json({ error: "text is required" });

    const audioRes = await elevenlabs.generateSpeechStream(text, {
      severity: severity || "high",
      model,
      voiceId,
    });

    res.set({
      "Content-Type": "audio/mpeg",
      "Transfer-Encoding": "chunked",
    });

    const reader = audioRes.body.getReader();
    const pump = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) { res.end(); return; }
        res.write(Buffer.from(value));
      }
    };
    pump().catch((err) => {
      console.error("Stream error:", err);
      res.end();
    });
  } catch (error) {
    console.error("TTS stream error:", error);
    res.status(500).json({ error: "TTS stream failed", details: error.message });
  }
});

app.post("/api/tts/analyze-and-speak", async (req, res) => {
  try {
    const { transactionData, walletAddress } = req.body;
    if (!transactionData) return res.status(400).json({ error: "transactionData is required" });

    const analysis = await analyzeTransactionRisk(transactionData, walletAddress);
    const severity = analysis.riskScore >= 90 ? "critical" : analysis.riskScore >= 75 ? "high" : "medium";

    const warningText = elevenlabs.buildWarningText(analysis.riskScore, {
      reason: analysis.reasons?.[0],
    });

    if (!warningText) {
      return res.json({ ...analysis, warningText: null, shouldPlay: false });
    }

    const audioRes = await elevenlabs.generateSpeech(warningText, { severity });
    const audioBuffer = Buffer.from(await audioRes.arrayBuffer());

    res.json({
      ...analysis,
      warningText,
      shouldPlay: true,
      audio: audioBuffer.toString("base64"),
      severity,
    });
  } catch (error) {
    console.error("Analyze and speak error:", error);
    res.status(500).json({ error: "Failed", details: error.message });
  }
});

app.post("/api/real/tx/:signature/analyze", async (req, res) => {
  try {
    const result = await realData.getTransactionRisk(req.params.signature);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/real/address/:address/risk", async (req, res) => {
  try {
    const result = await realData.getAddressRisk(req.params.address);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

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

app.post("/api/auth/login", async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/auth/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "No token" });
    const user = await authService.authenticate(token);
    res.json(user);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

app.post("/api/auth/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "No token" });
    const user = await authService.authenticate(token);
    const updated = await authService.updateProfile(user.walletAddress, req.body);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/auth/users", (req, res) => {
  res.json({ users: authService.listUsers(), total: authService.listUsers().length });
});

app.get("/api/community/fee-info", (req, res) => {
  res.json(communityService.getPlatformFeeInfo());
});

app.post("/api/community/create", async (req, res) => {
  try {
    const community = await communityService.createCommunity(req.body);
    res.json(community);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/community/:id", (req, res) => {
  const community = communityService.getCommunity(req.params.id);
  if (!community) return res.status(404).json({ error: "Community not found" });
  res.json(community);
});

app.get("/api/communities", (req, res) => {
  const filter = {};
  if (req.query.activeOnly === "true") filter.activeOnly = true;
  if (req.query.minBalance) filter.minBalance = Number(req.query.minBalance);
  const list = communityService.listCommunities(filter);
  res.json({ communities: list, total: list.length });
});

app.post("/api/community/:id/apply", async (req, res) => {
  try {
    const application = await communityService.applyToJoin(req.params.id, req.body);
    res.json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/community/:id/review-application", async (req, res) => {
  try {
    const { applicationId, accept, note } = req.body;
    if (!applicationId) return res.status(400).json({ error: "applicationId required" });
    const result = await communityService.reviewApplication(req.params.id, applicationId, accept, note);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/community/:id/donate", async (req, res) => {
  try {
    const result = await communityService.donateToCommunity(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/community/:id/set-stipend", async (req, res) => {
  try {
    const config = await communityService.setStipendConfig(req.params.id, req.body);
    res.json(config);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/community/:id/distribute-stipends", async (req, res) => {
  try {
    const distribution = await communityService.distributeStipends(req.params.id);
    res.json(distribution);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`VoiceChain backend running on port ${PORT}`);
  console.log(`Solana network: ${config.solana.network} @ ${config.solana.rpcUrl}`);
});

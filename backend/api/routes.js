const express = require("express");
const { PublicKey, LAMPORTS_PER_SOL } = require("@solana/web3.js");
const solanaService = require("../src/services/solana");

const router = express.Router();

router.post("/donate", async (req, res) => {
  try {
    const { scholarshipId, amount, donatorAddress } = req.body;

    if (!donatorAddress) {
      return res.status(400).json({ error: "donatorAddress is required" });
    }

    try {
      new PublicKey(donatorAddress);
    } catch {
      return res.status(400).json({ error: "Invalid donator address" });
    }

    const balance = await solanaService.getBalance(donatorAddress);
    const amountSol = parseFloat(amount);
    if (balance.sol < amountSol) {
      return res.status(400).json({
        error: "Insufficient balance",
        balance: balance.sol,
        required: amountSol,
      });
    }

    const latestBlockhash = await solanaService.getLatestBlockhash();

    res.json({
      success: true,
      message: "Donation transaction prepared",
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      donorBalance: balance.sol,
      tx: `mock_tx_signature_${Date.now()}`,
    });
  } catch (error) {
    console.error("Donation error:", error);
    res.status(500).json({ error: "Donation failed", details: error.message });
  }
});

router.post("/scholarship/create", async (req, res) => {
  try {
    const { name, description, student, totalAmount, milestones } = req.body;

    if (student) {
      try {
        new PublicKey(student);
      } catch {
        return res.status(400).json({ error: "Invalid student wallet address" });
      }
    }

    res.json({ success: true, message: "Scholarship created", id: `sch_${Date.now()}` });
  } catch (error) {
    res.status(500).json({ error: "Failed to create scholarship" });
  }
});

router.get("/scholarships", async (req, res) => {
  res.json({ scholarships: [] });
});

router.get("/scholarships/:id", async (req, res) => {
  res.json({ scholarship: null });
});

router.post("/milestone/approve", async (req, res) => {
  try {
    const { scholarshipId, milestoneId, voterAddress } = req.body;

    if (voterAddress) {
      try {
        new PublicKey(voterAddress);
      } catch {
        return res.status(400).json({ error: "Invalid voter address" });
      }
    }

    res.json({ success: true, message: "Milestone approved" });
  } catch (error) {
    res.status(500).json({ error: "Approval failed" });
  }
});

module.exports = router;

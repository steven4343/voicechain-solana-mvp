const express = require("express");
const router = express.Router();

router.post("/donate", async (req, res) => {
  try {
    const { scholarshipId, amount, donatorAddress } = req.body;
    res.json({ success: true, message: "Donation transaction submitted", tx: "mock_tx_signature" });
  } catch (error) {
    res.status(500).json({ error: "Donation failed" });
  }
});

router.post("/scholarship/create", async (req, res) => {
  try {
    const { name, description, student, totalAmount, milestones } = req.body;
    res.json({ success: true, message: "Scholarship created", id: "sch_new" });
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
    res.json({ success: true, message: "Milestone approved" });
  } catch (error) {
    res.status(500).json({ error: "Approval failed" });
  }
});

module.exports = router;

#!/usr/bin/env node
/**
 * VoiceChain Demo Script
 * Tests backend AI risk analysis, voice warnings, and mock scholarship interactions.
 *
 * Usage: node scripts/demo.js
 */

const DEMO_TRANSACTIONS = [
  { name: "Safe SOL Transfer", data: { destination: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU", amount: 1000000000, programId: "11111111111111111111111111111111", tokenTransfers: [] }, wallet: "DemoWallet123" },
  { name: "Large Amount Transfer", data: { destination: "9fB2abcDeFgHiJkLmNoPqRsTuVwXyZ1234567890", amount: 55000000000, programId: "11111111111111111111111111111111", tokenTransfers: [] }, wallet: "DemoWallet123" },
  { name: "Suspicious Program Interaction", data: { destination: "3kL9xyzAbCdEfGhIjKlMnOpQrStUvWxYz987654", amount: 2500000000, programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA", tokenTransfers: [{ mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", amount: 1000000000 }] }, wallet: "DemoWallet123" },
];

async function runDemo() {
  const BASE_URL = process.env.BACKEND_URL || "http://localhost:3001";

  console.log("\n=== VoiceChain Demo ===\n");

  // 1. Health check
  console.log("1. Checking backend health...");
  try {
    const health = await fetch(`${BASE_URL}/health`);
    const healthData = await health.json();
    console.log(`   Status: ${healthData.status} ✓\n`);
  } catch (e) {
    console.log("   Backend not running. Start with: cd backend && npm run dev\n");
    process.exit(1);
  }

  // 2. Test risk analysis
  console.log("2. Testing AI Risk Analysis...");
  for (const tx of DEMO_TRANSACTIONS) {
    console.log(`\n   --- ${tx.name} ---`);
    const res = await fetch(`${BASE_URL}/api/risk/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactionData: tx.data, walletAddress: tx.wallet }),
    });
    const result = await res.json();
    console.log(`   Risk Score: ${result.riskScore}/100 (${result.riskLevel})`);
    console.log(`   Reasons: ${result.reasons.join(", ")}`);
    console.log(`   Recommendation: ${result.recommendation}`);

    // 3. Test voice warning for high risk
    if (result.riskScore >= 70) {
      console.log(`   → Would trigger voice warning (score >= 70)`);
      const voiceRes = await fetch(`${BASE_URL}/api/risk/voice-warning`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ riskScore: result.riskScore, details: result }),
      });
      const voiceData = await voiceRes.json();
      console.log(`   → Voice message: "${voiceData.message}"`);
    }
  }

  // 4. Check analytics
  console.log("\n3. Fetching analytics...");
  const summaryRes = await fetch(`${BASE_URL}/api/analytics/summary`);
  const summary = await summaryRes.json();
  console.log(`   Total Transactions: ${summary.totalTransactions}`);
  console.log(`   Blocked: ${summary.blockedTransactions}`);
  console.log(`   Avg Risk Score: ${summary.averageRiskScore}`);
  console.log(`   Protected Amount: ${summary.protectedAmount}`);

  const historyRes = await fetch(`${BASE_URL}/api/analytics/risk-history`);
  const history = await historyRes.json();
  console.log(`   Risk history entries: ${history.history.length}`);

  console.log("\n=== Demo Complete ===");
  console.log("\nMock transaction signatures for frontend testing:");
  console.log("  - safe_tx_001    → Low risk (15)");
  console.log("  - risky_tx_002   → Medium risk (55)");
  console.log("  - malicious_tx_003 → Critical risk (91)\n");
}

runDemo().catch(console.error);

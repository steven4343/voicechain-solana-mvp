const solanaService = require("./solana");
const { analyzeTransactionRisk } = require("../../ai-risk-engine/analyzer");
const elevenlabs = require("./elevenlabs");

async function getTransactionRisk(signature) {
  const tx = await solanaService.getTransaction(signature);
  if (!tx) throw new Error("Transaction not found");

  const transactionData = {
    signature,
    slot: tx.slot,
    blockTime: tx.blockTime,
    destination: tx.transaction?.message?.accountKeys?.[1]?.toBase58?.() || tx.transaction?.message?.accountKeys?.[1] || "unknown",
    amount: tx.meta?.postBalances?.[0] != null && tx.meta?.preBalances?.[0] != null
      ? Math.abs(tx.meta.postBalances[0] - tx.meta.preBalances[0])
      : 0,
    programId: tx.transaction?.message?.instructions?.[0]?.programId?.toBase58?.() || "unknown",
    fee: tx.meta?.fee || 0,
    success: tx.meta?.err === null,
  };

  const analysis = await analyzeTransactionRisk(transactionData, null);

  const riskLevel = analysis.riskScore >= 90 ? "critical"
    : analysis.riskScore >= 75 ? "high"
    : analysis.riskScore >= 60 ? "medium"
    : "low";

  const warningText = elevenlabs.buildWarningText(analysis.riskScore, {
    reason: analysis.reasons?.[0],
  });

  return {
    transaction: transactionData,
    analysis: { ...analysis, riskLevel },
    warningText,
    shouldAlert: analysis.riskScore >= 60,
  };
}

async function getAddressRisk(address) {
  const balance = await solanaService.getBalance(address);
  const signatures = await solanaService.getSignaturesForAddress(address, 20);

  const recentTxs = [];
  for (const sig of signatures.slice(0, 5)) {
    try {
      const tx = await solanaService.getTransaction(sig.signature);
      if (tx) recentTxs.push(tx);
    } catch {}
  }

  const failedCount = recentTxs.filter((t) => t.meta?.err !== null).length;
  const uniquePrograms = new Set();
  for (const tx of recentTxs) {
    for (const ix of tx.transaction?.message?.instructions || []) {
      const pid = ix.programId?.toBase58?.() || ix.programId;
      if (pid) uniquePrograms.add(pid);
    }
  }

  const riskScore = Math.min(
    20 +
    (signatures.length < 5 ? 15 : 0) +
    (failedCount > 2 ? 20 : 0) +
    (uniquePrograms.size > 5 ? 15 : 0) +
    (balance.sol < 0.1 ? 10 : 0),
    100
  );

  const riskLevel = riskScore >= 75 ? "high" : riskScore >= 40 ? "medium" : "low";

  return {
    address,
    balance,
    transactionCount: signatures.length,
    recentTransactions: recentTxs.length,
    failedCount,
    uniquePrograms: [...uniquePrograms],
    riskScore,
    riskLevel,
  };
}

module.exports = { getTransactionRisk, getAddressRisk };

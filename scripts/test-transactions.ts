/**
 * VoiceChain - Quick Test Transactions
 * Paste these into the Transaction Analyzer page to test different risk levels.
 */

export const MOCK_TRANSACTIONS = [
  {
    id: "safe_tx_001",
    description: "Normal SOL transfer to known wallet",
    expectedRisk: "Low (15)",
    transactionData: {
      destination: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      amount: 1000000000, // 1 SOL
      programId: "11111111111111111111111111111111",
      tokenTransfers: [],
    },
  },
  {
    id: "risky_tx_002",
    description: "Unusual token approval pattern",
    expectedRisk: "Medium (55)",
    transactionData: {
      destination: "3kL9xyzAbCdEfGhIjKlMnOpQrStUvWxYz987654",
      amount: 2500000000, // 2.5 SOL
      programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      tokenTransfers: [
        { mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", amount: 1000000000 },
      ],
    },
  },
  {
    id: "malicious_tx_003",
    description: "Known phishing address interaction",
    expectedRisk: "Critical (91)",
    transactionData: {
      destination: "9fB2abcDeFgHiJkLmNoPqRsTuVwXyZ1234567890",
      amount: 50000000000, // 50 SOL
      programId: "11111111111111111111111111111111",
      tokenTransfers: [],
    },
  },
];

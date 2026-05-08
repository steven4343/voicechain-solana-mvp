const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
    "X-Title": "VoiceChain",
  },
});

async function analyzeTransactionRisk(transactionData, walletAddress) {
  const prompt = buildRiskPrompt(transactionData, walletAddress);

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.AI_MODEL || "mistralai/mistral-7b-instruct",
      messages: [
        {
          role: "system",
          content: "You are a blockchain security analyst. Analyze Solana transactions for risk. Return ONLY a JSON object with: { riskScore: number (0-100), riskLevel: string (low|medium|high|critical), reasons: string[], recommendation: string }",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const response = completion.choices[0].message.content.trim();
    let result;

    try {
      result = JSON.parse(response);
    } catch {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        result = fallbackAnalysis(transactionData);
      }
    }

    return {
      riskScore: result.riskScore || 0,
      riskLevel: result.riskLevel || "low",
      reasons: result.reasons || ["Unable to analyze"],
      recommendation: result.recommendation || "Proceed with caution",
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("OpenRouter API error:", error);
    return fallbackAnalysis(transactionData);
  }
}

function buildRiskPrompt(transactionData, walletAddress) {
  return `Analyze this Solana transaction for security risks:

Transaction Details:
${JSON.stringify(transactionData, null, 2)}

Wallet Address: ${walletAddress || "Not provided"}

Check for:
1. Known malicious addresses or programs
2. Unusual token transfers or approvals
3. Suspicious program interactions
4. Abnormal transaction patterns
5. Phishing indicators
6. MEV bot interactions
7. Unauthorized token approvals

Return a JSON response with riskScore (0-100), riskLevel, reasons array, and recommendation.`;
}

function fallbackAnalysis(transactionData) {
  let riskScore = 20;
  const reasons = [];

  if (transactionData.destination && transactionData.amount) {
    const amountInSol = transactionData.amount / 1e9;
    if (amountInSol > 10) {
      riskScore += 30;
      reasons.push(`Large transaction amount: ${amountInSol.toFixed(2)} SOL`);
    }
    if (amountInSol > 50) {
      riskScore += 20;
      reasons.push("Very large amount increases risk significantly");
    }
  }

  if (transactionData.programId && transactionData.programId !== "11111111111111111111111111111111") {
    riskScore += 15;
    reasons.push("Interaction with non-system program detected");
  }

  if (transactionData.tokenTransfers && transactionData.tokenTransfers.length > 3) {
    riskScore += 25;
    reasons.push("Multiple token transfers in single transaction");
  }

  if (riskScore >= 70) {
    return {
      riskScore: Math.min(riskScore, 100),
      riskLevel: riskScore >= 90 ? "critical" : "high",
      reasons: reasons.length ? reasons : ["Suspicious pattern detected"],
      recommendation: "Do not proceed with this transaction",
    };
  }

  return {
    riskScore: Math.min(riskScore, 100),
    riskLevel: riskScore >= 40 ? "medium" : "low",
    reasons: reasons.length ? reasons : ["No significant risks detected"],
    recommendation: "Transaction appears safe",
  };
}

module.exports = { analyzeTransactionRisk };

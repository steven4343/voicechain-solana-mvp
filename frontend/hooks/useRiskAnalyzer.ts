import { useState, useCallback } from "react";
import { RiskAnalysis } from "../types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export const useRiskAnalyzer = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastResult, setLastResult] = useState<RiskAnalysis | null>(null);

  const analyze = useCallback(async (transactionData: object, walletAddress?: string): Promise<RiskAnalysis> => {
    setIsAnalyzing(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/risk/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionData, walletAddress }),
      });

      if (!response.ok) throw new Error("Analysis failed");

      const result = await response.json();
      setLastResult(result);
      return result;
    } catch (error) {
      console.error("Risk analysis error:", error);
      const fallback: RiskAnalysis = {
        riskScore: 50,
        riskLevel: "medium",
        reasons: ["Unable to connect to analysis service"],
        recommendation: "Manual review recommended",
        timestamp: Date.now(),
      };
      setLastResult(fallback);
      return fallback;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return { analyze, isAnalyzing, lastResult };
};

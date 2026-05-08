import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { RiskAnalysis, Transaction, Scholarship, WithdrawalRequest } from "../types";

interface AppContextType {
  riskHistory: RiskAnalysis[];
  addRiskAnalysis: (analysis: RiskAnalysis) => void;
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
  voiceEnabled: boolean;
  toggleVoice: () => void;
  isSpeaking: boolean;
  scholarships: Scholarship[];
  withdrawalRequests: WithdrawalRequest[];
  setScholarships: (s: Scholarship[]) => void;
  setWithdrawalRequests: (w: WithdrawalRequest[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};

const MOCK_SCHOLARSHIPS: Scholarship[] = [
  {
    id: "sch_1",
    name: "Blockchain Education Fund",
    description: "Supporting students learning blockchain development",
    student: "7xKX...p3Qm",
    totalAmount: 500,
    fundedAmount: 325,
    isActive: true,
    milestones: [
      { id: "m1", description: "Complete Solana basics course", amount: 100, isApproved: true, isCompleted: true, approvalCount: 3 },
      { id: "m2", description: "Build first smart contract", amount: 150, isApproved: true, isCompleted: false, approvalCount: 2 },
      { id: "m3", description: "Deploy dApp to mainnet", amount: 250, isApproved: false, isCompleted: false, approvalCount: 0 },
    ],
  },
  {
    id: "sch_2",
    name: "DeFi Research Grant",
    description: "Funding research into decentralized finance protocols",
    student: "9mKw...x8Rt",
    totalAmount: 1000,
    fundedAmount: 600,
    isActive: true,
    milestones: [
      { id: "m4", description: "Literature review", amount: 200, isApproved: true, isCompleted: true, approvalCount: 3 },
      { id: "m5", description: "Prototype development", amount: 400, isApproved: false, isCompleted: false, approvalCount: 1 },
      { id: "m6", description: "Publish findings", amount: 400, isApproved: false, isCompleted: false, approvalCount: 0 },
    ],
  },
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [riskHistory, setRiskHistory] = useState<RiskAnalysis[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [scholarships, setScholarships] = useState<Scholarship[]>(MOCK_SCHOLARSHIPS);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);

  const addRiskAnalysis = useCallback((analysis: RiskAnalysis) => {
    setRiskHistory((prev) => [analysis, ...prev].slice(0, 50));
  }, []);

  const addTransaction = useCallback((tx: Transaction) => {
    setTransactions((prev) => [tx, ...prev].slice(0, 20));
  }, []);

  const toggleVoice = useCallback(() => setVoiceEnabled((v) => !v), []);

  return (
    <AppContext.Provider
      value={{
        riskHistory,
        addRiskAnalysis,
        transactions,
        addTransaction,
        voiceEnabled,
        toggleVoice,
        isSpeaking,
        scholarships,
        withdrawalRequests,
        setScholarships,
        setWithdrawalRequests,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

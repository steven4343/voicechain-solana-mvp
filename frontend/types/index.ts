export interface Transaction {
  signature: string;
  timestamp: number;
  amount: number;
  destination: string;
  status: "confirmed" | "failed" | "pending";
  riskScore: number;
}

export interface RiskAnalysis {
  riskScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  reasons: string[];
  recommendation: string;
  timestamp: number;
}

export interface Scholarship {
  id: string;
  name: string;
  description: string;
  student: string;
  totalAmount: number;
  fundedAmount: number;
  isActive: boolean;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  description: string;
  amount: number;
  isApproved: boolean;
  isCompleted: boolean;
  approvalCount: number;
}

export interface WithdrawalRequest {
  id: string;
  scholarshipId: string;
  scholarshipName: string;
  student: string;
  amount: number;
  milestoneId: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: number;
}

export interface AnalyticsData {
  totalTransactions: number;
  blockedTransactions: number;
  averageRiskScore: number;
  highRiskDetected: number;
  protectedAmount: string;
  riskHistory: { timestamp: number; score: number }[];
}

export interface WalletState {
  connected: boolean;
  publicKey: string | null;
  balance: number;
}

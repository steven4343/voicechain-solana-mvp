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

export interface Milestone {
  id: string;
  description: string;
  amount: number;
  isApproved: boolean;
  isCompleted: boolean;
  approvalCount: number;
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
  communityId?: string;
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

export interface FundingRecipient {
  id: string;
  name: string;
  description: string;
  amountReceived: number;
}

export interface Donation {
  id: string;
  donor: string;
  donorName: string;
  amount: number;
  groupId: string;
  timestamp: number;
  message?: string;
  fee?: number;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  creator: string;
  memberCount: number;
  totalFundingGoal: number;
  totalFunded: number;
  isActive: boolean;
  recipients: FundingRecipient[];
  donations: Donation[];
  createdAt: number;
}

export type MemberRole = "admin" | "member" | "donor";
export type ApplicationStatus = "pending" | "approved" | "rejected";
export type StipendFrequency = "weekly" | "biweekly" | "monthly" | "milestone";

export interface CommunityMember {
  id: string;
  communityId: string;
  walletAddress: string;
  name: string;
  role: MemberRole;
  joinedAt: number;
  totalStipendsReceived: number;
  isActive: boolean;
}

export interface JoinApplication {
  id: string;
  communityId: string;
  applicantWallet: string;
  applicantName: string;
  reason: string;
  status: ApplicationStatus;
  appliedAt: number;
  reviewedAt?: number;
  reviewNote?: string;
}

export interface StipendConfig {
  amountPerMember: number;
  frequency: StipendFrequency;
  lastDistributedAt?: number;
  totalDistributed: number;
}

export interface StipendDistribution {
  id: string;
  communityId: string;
  totalAmount: number;
  recipients: number;
  timestamp: number;
  txSignature?: string;
  fee?: number;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  adminWallet: string;
  adminName: string;
  communityWallet: string;
  memberCount: number;
  fundingGoal: number;
  currentBalance: number;
  isActive: boolean;
  createdAt: number;
  members: CommunityMember[];
  applications: JoinApplication[];
  stipendConfig?: StipendConfig;
  stipendDistributions: StipendDistribution[];
  donations: Donation[];
}

export interface PlatformFeeConfig {
  feePercent: number;
  treasuryWallet: string;
}

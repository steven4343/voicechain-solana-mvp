import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import {
  RiskAnalysis, Transaction as TxType, Scholarship, Milestone, Group, Donation,
  Community, CommunityMember, JoinApplication, StipendConfig, StipendDistribution,
  PlatformFeeConfig, ApplicationStatus, MemberRole
} from "../types";

export interface TxForReview {
  id: string;
  to: string;
  amount: string;
  amountNum: number;
  riskScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  timestamp: number;
  status: "pending" | "approved" | "rejected";
  reasons: string[];
  aiExplanation: string;
}

export interface SettingsState {
  voiceAuth: boolean;
  aiScamDetection: boolean;
  autoBlockHighRisk: boolean;
  transactionAlerts: boolean;
  securityWarnings: boolean;
  emailNotifications: boolean;
}

export interface PendingApproval {
  id: string;
  scholarshipId: string;
  scholarshipName: string;
  student: string;
  milestone: string;
  amount: string;
  amountNum: number;
  requiredVotes: number;
  currentVotes: number;
  documents: string[];
  myVote: "none" | "approve" | "reject";
}

export interface DonorDeposit {
  id: string;
  donor: string;
  address: string;
  amount: string;
  scholarships: number;
  timestamp: number;
}

interface AppStats {
  totalScanned: number;
  threatsBlocked: number;
  safeTransactions: number;
  pendingReview: number;
  activeScholarships: number;
  totalFunds: number;
  fundsReleased: number;
  pendingApprovals: number;
}

interface AppContextType {
  riskHistory: RiskAnalysis[];
  addRiskAnalysis: (analysis: RiskAnalysis) => void;
  transactions: TxForReview[];
  addTransaction: (tx: TxForReview) => void;
  updateTransactionStatus: (id: string, status: "approved" | "rejected") => void;
  voiceEnabled: boolean;
  toggleVoice: () => void;
  isSpeaking: boolean;
  scholarships: Scholarship[];
  setScholarships: (s: Scholarship[]) => void;
  pendingApprovals: PendingApproval[];
  voteOnMilestone: (approvalId: string, vote: "approve" | "reject") => void;
  donorDeposits: DonorDeposit[];
  settings: SettingsState;
  updateSetting: (key: keyof SettingsState, value: boolean) => void;
  groups: Group[];
  setGroups: (g: Group[]) => void;
  addDonation: (donation: Donation) => void;
  stats: AppStats;
  refreshStats: () => void;
  communities: Community[];
  createCommunity: (name: string, description: string, fundingGoal: number) => void;
  applyToJoin: (communityId: string, applicantName: string, reason: string) => void;
  reviewApplication: (communityId: string, applicationId: string, accept: boolean, note?: string) => void;
  donateToCommunity: (communityId: string, donorName: string, amount: number, message?: string) => Donation;
  setStipendConfig: (communityId: string, config: StipendConfig) => void;
  distributeStipends: (communityId: string) => StipendDistribution | null;
  platformFee: PlatformFeeConfig;
  calculateFee: (amount: number) => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};

const PLATFORM_FEE: PlatformFeeConfig = {
  feePercent: 2.5,
  treasuryWallet: "VoiceChainTreasury",
};

const MOCK_GROUPS: Group[] = [
  {
    id: "grp_1", name: "Tech Education for Kids",
    description: "Funding coding bootcamps for underprivileged children in rural communities",
    creator: "Alice Johnson", memberCount: 45, totalFundingGoal: 50000, totalFunded: 32500,
    isActive: true,
    recipients: [
      { id: "r1", name: "Maria Santos", description: "Full scholarship for 6-month web dev bootcamp", amountReceived: 12000 },
      { id: "r2", name: "James Kim", description: "Laptop and course materials fund", amountReceived: 8500 },
      { id: "r3", name: "Priya Patel", description: "Transportation and living stipend", amountReceived: 7000 },
    ],
    donations: [
      { id: "d1", donor: "TechCorp Foundation", donorName: "TechCorp Foundation", amount: 15000, groupId: "grp_1", timestamp: Date.now() - 86400000 * 3, message: "Keep up the great work!" },
      { id: "d2", donor: "anon_1", donorName: "Anonymous", amount: 5000, groupId: "grp_1", timestamp: Date.now() - 86400000 * 7 },
      { id: "d3", donor: "donor_2", donorName: "Sarah Chen", amount: 2500, groupId: "grp_1", timestamp: Date.now() - 86400000 * 12, message: "For the children's future" },
    ],
    createdAt: Date.now() - 86400000 * 30,
  },
  {
    id: "grp_2", name: "Community Health Initiative",
    description: "Providing medical supplies and healthcare access to underserved neighborhoods",
    creator: "Dr. Robert Williams", memberCount: 28, totalFundingGoal: 75000, totalFunded: 41200,
    isActive: true,
    recipients: [
      { id: "r4", name: "Hope Clinic", description: "Emergency medical supplies", amountReceived: 18000 },
      { id: "r5", name: "Mobile Health Unit", description: "Monthly operation costs", amountReceived: 15000 },
      { id: "r6", name: "Wellness Program", description: "Community health worker training", amountReceived: 8200 },
    ],
    donations: [
      { id: "d4", donor: "donor_3", donorName: "Global Health Org", amount: 20000, groupId: "grp_2", timestamp: Date.now() - 86400000 * 5 },
      { id: "d5", donor: "anon_2", donorName: "Anonymous", amount: 3000, groupId: "grp_2", timestamp: Date.now() - 86400000 * 10 },
    ],
    createdAt: Date.now() - 86400000 * 45,
  },
  {
    id: "grp_3", name: "Local Artists Collective",
    description: "Supporting emerging local artists with studio space, materials, and exhibition opportunities",
    creator: "Maria Gonzalez", memberCount: 15, totalFundingGoal: 25000, totalFunded: 8900,
    isActive: true,
    recipients: [
      { id: "r7", name: "Studio Rental Fund", description: "Shared studio space for 3 months", amountReceived: 4500 },
      { id: "r8", name: "Art Materials Grant", description: "Supplies for 10 artists", amountReceived: 2400 },
    ],
    donations: [
      { id: "d6", donor: "donor_4", donorName: "Arts Council", amount: 5000, groupId: "grp_3", timestamp: Date.now() - 86400000 * 3 },
      { id: "d7", donor: "anon_3", donorName: "Anonymous", amount: 1000, groupId: "grp_3", timestamp: Date.now() - 86400000 * 8, message: "Love supporting local art!" },
    ],
    createdAt: Date.now() - 86400000 * 15,
  },
];

const MOCK_SCHOLARSHIPS: Scholarship[] = [
  {
    id: "sch_1", name: "Blockchain Education Fund",
    description: "Supporting students learning blockchain development",
    student: "7xKX...p3Qm", totalAmount: 500, fundedAmount: 325, isActive: true,
    milestones: [
      { id: "m1", description: "Complete Solana basics course", amount: 100, isApproved: true, isCompleted: true, approvalCount: 3 },
      { id: "m2", description: "Build first smart contract", amount: 150, isApproved: true, isCompleted: false, approvalCount: 2 },
      { id: "m3", description: "Deploy dApp to mainnet", amount: 250, isApproved: false, isCompleted: false, approvalCount: 0 },
    ],
    communityId: "community_1",
  },
  {
    id: "sch_2", name: "DeFi Research Grant",
    description: "Funding research into decentralized finance protocols",
    student: "9mKw...x8Rt", totalAmount: 1000, fundedAmount: 600, isActive: true,
    milestones: [
      { id: "m4", description: "Literature review", amount: 200, isApproved: true, isCompleted: true, approvalCount: 3 },
      { id: "m5", description: "Prototype development", amount: 400, isApproved: false, isCompleted: false, approvalCount: 1 },
      { id: "m6", description: "Publish findings", amount: 400, isApproved: false, isCompleted: false, approvalCount: 0 },
    ],
  },
];

const INITIAL_TRANSACTIONS: TxForReview[] = [
  {
    id: "tx_1", to: "9fB2...xT8n", amount: "5.0 SOL", amountNum: 5.0,
    riskScore: 85, riskLevel: "high", timestamp: Date.now(), status: "pending",
    reasons: ["New wallet address (created 2 days ago)", "No previous transaction history", "Unusual transaction amount for new wallet"],
    aiExplanation: "This transaction is flagged as high risk because the recipient wallet is newly created with no established transaction history.",
  },
  {
    id: "tx_2", to: "3kL9...mP2q", amount: "2.5 SOL", amountNum: 2.5,
    riskScore: 45, riskLevel: "medium", timestamp: Date.now() - 300000, status: "pending",
    reasons: ["Wallet has received funds from 15+ different sources", "Pattern matches known mixer activity"],
    aiExplanation: "This wallet shows patterns consistent with mixing services.",
  },
  {
    id: "tx_3", to: "7hN4...vQ8r", amount: "0.5 SOL", amountNum: 0.5,
    riskScore: 15, riskLevel: "low", timestamp: Date.now() - 3600000, status: "approved",
    reasons: ["Established wallet with 2+ years history", "Verified smart contract interaction"],
    aiExplanation: "This transaction appears safe.",
  },
];

const INITIAL_PENDING_APPROVALS: PendingApproval[] = [
  { id: "app_1", scholarshipId: "sch_1", scholarshipName: "Blockchain Education Fund", student: "Alice Johnson", milestone: "Project Submission", amount: "3 SOL", amountNum: 3, requiredVotes: 3, currentVotes: 2, documents: ["project_report.pdf", "code_repository.zip"], myVote: "none" },
  { id: "app_2", scholarshipId: "sch_2", scholarshipName: "DeFi Research Grant", student: "Bob Martinez", milestone: "Final Project", amount: "2 SOL", amountNum: 2, requiredVotes: 3, currentVotes: 1, documents: ["final_project.pdf"], myVote: "none" },
];

const INITIAL_DONOR_DEPOSITS: DonorDeposit[] = [
  { id: "dep_1", donor: "TechCorp Foundation", address: "9fB2...xT8n", amount: "50 SOL", scholarships: 5, timestamp: Date.now() - 172800000 },
  { id: "dep_2", donor: "Anonymous Donor", address: "3kL9...mP2q", amount: "25 SOL", scholarships: 3, timestamp: Date.now() - 604800000 },
  { id: "dep_3", donor: "Education Alliance", address: "7hN4...vQ8r", amount: "30 SOL", scholarships: 4, timestamp: Date.now() - 1209600000 },
];

const DEFAULT_SETTINGS: SettingsState = {
  voiceAuth: true, aiScamDetection: true, autoBlockHighRisk: false,
  transactionAlerts: true, securityWarnings: true, emailNotifications: true,
};

const MOCK_COMMUNITIES: Community[] = [
  {
    id: "community_1",
    name: "Web3 Scholars DAO",
    description: "A community of blockchain learners funding each other's education through milestone-based scholarships and peer review.",
    adminWallet: "Adm1n...Wallet",
    adminName: "Alice Johnson",
    communityWallet: "ComW...allet1",
    memberCount: 12,
    fundingGoal: 25000,
    currentBalance: 8200,
    isActive: true,
    createdAt: Date.now() - 86400000 * 60,
    members: [
      { id: "cm_1", communityId: "community_1", walletAddress: "Adm1n...Wallet", name: "Alice Johnson", role: "admin", joinedAt: Date.now() - 86400000 * 60, totalStipendsReceived: 0, isActive: true },
      { id: "cm_2", communityId: "community_1", walletAddress: "7xKX...p3Qm", name: "Bob Student", role: "member", joinedAt: Date.now() - 86400000 * 45, totalStipendsReceived: 2.5, isActive: true },
      { id: "cm_3", communityId: "community_1", walletAddress: "9mKw...x8Rt", name: "Carol Builder", role: "member", joinedAt: Date.now() - 86400000 * 30, totalStipendsReceived: 1.0, isActive: true },
    ],
    applications: [
      { id: "app_1", communityId: "community_1", applicantWallet: "3kL9...new", applicantName: "David New", reason: "I want to learn Solana development and contribute to the DAO", status: "pending", appliedAt: Date.now() - 86400000 * 2 },
    ],
    stipendConfig: {
      amountPerMember: 0.5,
      frequency: "monthly",
      lastDistributedAt: Date.now() - 86400000 * 20,
      totalDistributed: 3.5,
    },
    stipendDistributions: [
      { id: "sd_1", communityId: "community_1", totalAmount: 3.5, recipients: 3, timestamp: Date.now() - 86400000 * 20, fee: 0.09 },
    ],
    donations: [
      { id: "d_com_1", donor: "Large Donor", donorName: "TechCorp Foundation", amount: 5000, groupId: "community_1", timestamp: Date.now() - 86400000 * 10, message: "For the scholars!", fee: 125 },
      { id: "d_com_2", donor: "anon_d_1", donorName: "Anonymous", amount: 200, groupId: "community_1", timestamp: Date.now() - 86400000 * 5, fee: 5 },
    ],
  },
  {
    id: "community_2",
    name: "Crypto for Good",
    description: "Funding real-world impact projects with crypto donations. Supporting education, health, and environment initiatives.",
    adminWallet: "Seco...ndAdm",
    adminName: "Dr. Robert Williams",
    communityWallet: "ComW...allet2",
    memberCount: 8,
    fundingGoal: 50000,
    currentBalance: 15400,
    isActive: true,
    createdAt: Date.now() - 86400000 * 35,
    members: [
      { id: "cm_4", communityId: "community_2", walletAddress: "Seco...ndAdm", name: "Dr. Robert Williams", role: "admin", joinedAt: Date.now() - 86400000 * 35, totalStipendsReceived: 0, isActive: true },
      { id: "cm_5", communityId: "community_2", walletAddress: "7xKX...p3Qm", name: "Emily Grant", role: "member", joinedAt: Date.now() - 86400000 * 20, totalStipendsReceived: 1.5, isActive: true },
    ],
    applications: [],
    stipendDistributions: [],
    donations: [
      { id: "d_com_3", donor: "donor_5", donorName: "Global Health Org", amount: 10000, groupId: "community_2", timestamp: Date.now() - 86400000 * 15, fee: 250 },
    ],
  },
];

function loadState<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = localStorage.getItem(`voicechain_${key}`);
    if (stored) return JSON.parse(stored);
  } catch {}
  return fallback;
}

function saveState(key: string, value: any) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(`voicechain_${key}`, JSON.stringify(value)); } catch {}
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [riskHistory, setRiskHistory] = useState<RiskAnalysis[]>(() => loadState("riskHistory", []));
  const [transactions, setTransactions] = useState<TxForReview[]>(() => loadState("transactions", INITIAL_TRANSACTIONS));
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [scholarships, setScholarships] = useState<Scholarship[]>(MOCK_SCHOLARSHIPS);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>(() => loadState("pendingApprovals", INITIAL_PENDING_APPROVALS));
  const [donorDeposits] = useState<DonorDeposit[]>(INITIAL_DONOR_DEPOSITS);
  const [settings, setSettings] = useState<SettingsState>(() => loadState("settings", DEFAULT_SETTINGS));
  const [groups, setGroups] = useState<Group[]>(() => loadState("groups", MOCK_GROUPS));
  const [communities, setCommunities] = useState<Community[]>(() => loadState("communities", MOCK_COMMUNITIES));

  const [stats, setStats] = useState<AppStats>({
    totalScanned: 47, threatsBlocked: 3, safeTransactions: 44, pendingReview: 2,
    activeScholarships: 12, totalFunds: 105, fundsReleased: 42, pendingApprovals: 5,
  });

  const refreshStats = useCallback(() => {
    const pendingCount = transactions.filter((t) => t.status === "pending").length;
    const rejectedCount = transactions.filter((t) => t.status === "rejected").length;
    const approvedCount = transactions.filter((t) => t.status === "approved").length;
    const pendingVoteCount = pendingApprovals.filter((a) => a.myVote === "none").length;
    setStats({
      totalScanned: transactions.length + 40, threatsBlocked: rejectedCount + 3,
      safeTransactions: approvedCount + 40, pendingReview: pendingCount,
      activeScholarships: scholarships.length + 10, totalFunds: 105,
      fundsReleased: 42, pendingApprovals: pendingVoteCount,
    });
  }, [transactions, pendingApprovals, scholarships.length]);

  useEffect(() => { saveState("transactions", transactions); refreshStats(); }, [transactions, refreshStats]);
  useEffect(() => { saveState("pendingApprovals", pendingApprovals); refreshStats(); }, [pendingApprovals, refreshStats]);
  useEffect(() => { saveState("settings", settings); }, [settings]);
  useEffect(() => { saveState("groups", groups); }, [groups]);
  useEffect(() => { saveState("riskHistory", riskHistory); }, [riskHistory]);
  useEffect(() => { saveState("communities", communities); }, [communities]);

  const addRiskAnalysis = useCallback((analysis: RiskAnalysis) => {
    setRiskHistory((prev) => [analysis, ...prev].slice(0, 50));
  }, []);

  const addTransaction = useCallback((tx: TxForReview) => {
    setTransactions((prev) => [tx, ...prev]);
  }, []);

  const updateTransactionStatus = useCallback((id: string, status: "approved" | "rejected") => {
    setTransactions((prev) => prev.map((tx) => (tx.id === id ? { ...tx, status } : tx)));
  }, []);

  const toggleVoice = useCallback(() => {
    setVoiceEnabled((v) => !v);
    setSettings((s) => ({ ...s, voiceAuth: !settings.voiceAuth }));
  }, [settings.voiceAuth]);

  const voteOnMilestone = useCallback((approvalId: string, vote: "approve" | "reject") => {
    setPendingApprovals((prev) =>
      prev.map((a) => {
        if (a.id === approvalId && a.myVote === "none") {
          const newVotes = vote === "approve" ? a.currentVotes + 1 : a.currentVotes;
          return { ...a, myVote: vote, currentVotes: newVotes };
        }
        return a;
      })
    );
  }, []);

  const updateSetting = useCallback((key: keyof SettingsState, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const addDonation = useCallback((donation: Donation) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === donation.groupId
          ? { ...g, donations: [...g.donations, donation], totalFunded: g.totalFunded + donation.amount }
          : g
      )
    );
  }, []);

  const calculateFee = useCallback((amount: number): number => {
    return Math.round((amount * PLATFORM_FEE.feePercent) / 100 * 100) / 100;
  }, []);

  const createCommunity = useCallback((name: string, description: string, fundingGoal: number) => {
    const newCommunity: Community = {
      id: `community_${Date.now()}`,
      name,
      description,
      adminWallet: "Your...Wallet",
      adminName: "You",
      communityWallet: `ComW...${Date.now().toString(36)}`,
      memberCount: 1,
      fundingGoal,
      currentBalance: 0,
      isActive: true,
      createdAt: Date.now(),
      members: [{
        id: `cm_${Date.now()}`,
        communityId: `community_${Date.now()}`,
        walletAddress: "Your...Wallet",
        name: "You",
        role: "admin",
        joinedAt: Date.now(),
        totalStipendsReceived: 0,
        isActive: true,
      }],
      applications: [],
      stipendDistributions: [],
      donations: [],
    };
    setCommunities((prev) => [newCommunity, ...prev]);
  }, []);

  const applyToJoin = useCallback((communityId: string, applicantName: string, reason: string) => {
    const application: JoinApplication = {
      id: `app_${Date.now()}`,
      communityId,
      applicantWallet: "Your...Wallet",
      applicantName,
      reason,
      status: "pending",
      appliedAt: Date.now(),
    };
    setCommunities((prev) =>
      prev.map((c) => c.id === communityId ? { ...c, applications: [...c.applications, application] } : c)
    );
  }, []);

  const reviewApplication = useCallback((communityId: string, applicationId: string, accept: boolean, note?: string) => {
    setCommunities((prev) =>
      prev.map((c) => {
        if (c.id !== communityId) return c;
        const updatedApplications = c.applications.map((a) =>
          a.id === applicationId ? { ...a, status: accept ? "approved" as ApplicationStatus : "rejected" as ApplicationStatus, reviewedAt: Date.now(), reviewNote: note } : a
        );
        if (!accept) return { ...c, applications: updatedApplications };
        const approved = c.applications.find((a) => a.id === applicationId);
        if (!approved) return { ...c, applications: updatedApplications };
        const newMember: CommunityMember = {
          id: `cm_${Date.now()}`,
          communityId,
          walletAddress: approved.applicantWallet,
          name: approved.applicantName,
          role: "member" as MemberRole,
          joinedAt: Date.now(),
          totalStipendsReceived: 0,
          isActive: true,
        };
        return {
          ...c,
          applications: updatedApplications,
          members: [...c.members, newMember],
          memberCount: c.memberCount + 1,
        };
      })
    );
  }, []);

  const donateToCommunity = useCallback((communityId: string, donorName: string, amount: number, message?: string): Donation => {
    const fee = calculateFee(amount);
    const netAmount = amount - fee;
    const donation: Donation = {
      id: `d_com_${Date.now()}`,
      donor: donorName || "anon_" + Date.now(),
      donorName: donorName || "Anonymous",
      amount: netAmount,
      groupId: communityId,
      timestamp: Date.now(),
      message,
      fee,
    };
    setCommunities((prev) =>
      prev.map((c) =>
        c.id === communityId
          ? { ...c, donations: [...c.donations, donation], currentBalance: c.currentBalance + netAmount }
          : c
      )
    );
    return donation;
  }, [calculateFee]);

  const setStipendConfig = useCallback((communityId: string, config: StipendConfig) => {
    setCommunities((prev) =>
      prev.map((c) => c.id === communityId ? { ...c, stipendConfig: config } : c)
    );
  }, []);

  const distributeStipends = useCallback((communityId: string): StipendDistribution | null => {
    let distribution: StipendDistribution | null = null;
    setCommunities((prev) =>
      prev.map((c) => {
        if (c.id !== communityId || !c.stipendConfig) return c;
        const activeMembers = c.members.filter((m) => m.isActive && m.role !== "admin");
        if (activeMembers.length === 0) return c;
        const totalStipend = activeMembers.length * c.stipendConfig.amountPerMember;
        if (c.currentBalance < totalStipend) return c;
        const fee = calculateFee(totalStipend);
        const netStipend = totalStipend - fee;
        distribution = {
          id: `sd_${Date.now()}`,
          communityId,
          totalAmount: netStipend,
          recipients: activeMembers.length,
          timestamp: Date.now(),
          fee,
        };
        const perMember = netStipend / activeMembers.length;
        return {
          ...c,
          currentBalance: c.currentBalance - totalStipend,
          members: c.members.map((m) =>
            m.isActive && m.role !== "admin"
              ? { ...m, totalStipendsReceived: m.totalStipendsReceived + perMember }
              : m
          ),
          stipendConfig: { ...c.stipendConfig, lastDistributedAt: Date.now(), totalDistributed: c.stipendConfig.totalDistributed + netStipend },
          stipendDistributions: [...c.stipendDistributions, distribution!],
        };
      })
    );
    return distribution;
  }, [calculateFee]);

  return (
    <AppContext.Provider
      value={{
        riskHistory, addRiskAnalysis,
        transactions, addTransaction, updateTransactionStatus,
        voiceEnabled, toggleVoice, isSpeaking,
        scholarships, setScholarships,
        pendingApprovals, voteOnMilestone,
        donorDeposits, settings, updateSetting,
        groups, setGroups, addDonation,
        stats, refreshStats,
        communities, createCommunity, applyToJoin, reviewApplication,
        donateToCommunity, setStipendConfig, distributeStipends,
        platformFee: PLATFORM_FEE, calculateFee,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

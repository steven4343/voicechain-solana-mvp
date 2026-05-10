const { PublicKey } = require("@solana/web3.js");
const solanaService = require("./solana");
const { config } = require("../config");

const PLATFORM_FEE_PERCENT = 2.5;
const FEE_BPS = Math.round(PLATFORM_FEE_PERCENT * 100);

function calculateFee(amount) {
  return Math.round(amount * FEE_BPS) / 10000;
}

function validateAndParseAddress(address) {
  try {
    return new PublicKey(address);
  } catch {
    throw new Error(`Invalid Solana address: ${address}`);
  }
}

const communities = new Map();

function getCommunity(id) {
  if (!communities.has(id)) return null;
  return communities.get(id);
}

function listCommunities(filter = {}) {
  let result = Array.from(communities.values());
  if (filter.activeOnly) result = result.filter((c) => c.isActive);
  if (filter.minBalance) result = result.filter((c) => c.currentBalance >= filter.minBalance);
  return result;
}

async function createCommunity(data) {
  const { name, description, adminWallet, fundingGoal } = data;

  if (!name || !description || !adminWallet) {
    throw new Error("name, description, and adminWallet are required");
  }

  const adminPubkey = validateAndParseAddress(adminWallet);
  const id = `community_${Date.now()}`;

  const community = {
    id,
    name,
    description,
    adminWallet: adminPubkey.toBase58(),
    adminName: data.adminName || "Unknown",
    communityWallet: `ComWallet_${id}`,
    memberCount: 1,
    fundingGoal: Number(fundingGoal) || 0,
    currentBalance: 0,
    isActive: true,
    createdAt: Date.now(),
    members: [{
      id: `cm_${Date.now()}`,
      communityId: id,
      walletAddress: adminPubkey.toBase58(),
      name: data.adminName || "Admin",
      role: "admin",
      joinedAt: Date.now(),
      totalStipendsReceived: 0,
      isActive: true,
    }],
    applications: [],
    stipendConfig: null,
    stipendDistributions: [],
    donations: [],
    feePercent: PLATFORM_FEE_PERCENT,
  };

  communities.set(id, community);
  return community;
}

async function applyToJoin(communityId, data) {
  const community = getCommunity(communityId);
  if (!community) throw new Error("Community not found");

  const { applicantName, reason } = data;

  const application = {
    id: `app_${Date.now()}`,
    communityId,
    applicantWallet: "Pending...Wallet",
    applicantName: applicantName || "Anonymous",
    reason: reason || "",
    status: "pending",
    appliedAt: Date.now(),
  };

  community.applications.push(application);
  return application;
}

async function reviewApplication(communityId, applicationId, accept, note) {
  const community = getCommunity(communityId);
  if (!community) throw new Error("Community not found");

  const appIndex = community.applications.findIndex((a) => a.id === applicationId);
  if (appIndex === -1) throw new Error("Application not found");

  const application = community.applications[appIndex];
  if (application.status !== "pending") throw new Error("Application already reviewed");

  application.status = accept ? "approved" : "rejected";
  application.reviewedAt = Date.now();
  application.reviewNote = note || "";

  if (accept) {
    const newMember = {
      id: `cm_${Date.now()}`,
      communityId,
      walletAddress: application.applicantWallet,
      name: application.applicantName,
      role: "member",
      joinedAt: Date.now(),
      totalStipendsReceived: 0,
      isActive: true,
    };
    community.members.push(newMember);
    community.memberCount = community.members.length;
  }

  return { community, application };
}

async function donateToCommunity(communityId, data) {
  const community = getCommunity(communityId);
  if (!community) throw new Error("Community not found");

  const { donorName, amount, message } = data;
  const donationAmount = Number(amount);
  if (!donationAmount || donationAmount <= 0) throw new Error("Invalid donation amount");

  const fee = calculateFee(donationAmount);
  const netAmount = donationAmount - fee;

  const donation = {
    id: `d_com_${Date.now()}`,
    donor: donorName || `anon_${Date.now()}`,
    donorName: donorName || "Anonymous",
    amount: netAmount,
    groupId: communityId,
    timestamp: Date.now(),
    message: message || "",
    fee,
    platformFeePercent: PLATFORM_FEE_PERCENT,
  };

  community.donations.push(donation);
  community.currentBalance += netAmount;

  return { donation, grossAmount: donationAmount, fee, netAmount };
}

async function setStipendConfig(communityId, data) {
  const community = getCommunity(communityId);
  if (!community) throw new Error("Community not found");

  const { amountPerMember, frequency } = data;
  if (!amountPerMember || !frequency) throw new Error("amountPerMember and frequency are required");

  community.stipendConfig = {
    amountPerMember: Number(amountPerMember),
    frequency,
    lastDistributedAt: community.stipendConfig?.lastDistributedAt || null,
    totalDistributed: community.stipendConfig?.totalDistributed || 0,
  };

  return community.stipendConfig;
}

async function distributeStipends(communityId) {
  const community = getCommunity(communityId);
  if (!community) throw new Error("Community not found");
  if (!community.stipendConfig) throw new Error("No stipend config set");

  const activeMembers = community.members.filter((m) => m.isActive && m.role !== "admin");
  if (activeMembers.length === 0) throw new Error("No active members to distribute to");

  const totalStipend = activeMembers.length * community.stipendConfig.amountPerMember;
  if (community.currentBalance < totalStipend) {
    throw new Error(`Insufficient balance. Need ${totalStipend}, have ${community.currentBalance}`);
  }

  const fee = calculateFee(totalStipend);
  const netStipend = totalStipend - fee;
  const perMember = netStipend / activeMembers.length;

  const distribution = {
    id: `sd_${Date.now()}`,
    communityId,
    totalAmount: netStipend,
    grossAmount: totalStipend,
    recipients: activeMembers.length,
    timestamp: Date.now(),
    fee,
    platformFeePercent: PLATFORM_FEE_PERCENT,
  };

  community.currentBalance -= totalStipend;
  community.members = community.members.map((m) =>
    m.isActive && m.role !== "admin"
      ? { ...m, totalStipendsReceived: m.totalStipendsReceived + perMember }
      : m
  );
  community.stipendConfig.lastDistributedAt = Date.now();
  community.stipendConfig.totalDistributed += netStipend;
  community.stipendDistributions.push(distribution);

  return distribution;
}

async function getPlatformFeeInfo() {
  return {
    feePercent: PLATFORM_FEE_PERCENT,
    feeBps: FEE_BPS,
    treasuryWallet: process.env.TREASURY_WALLET || "VoiceChainTreasury",
  };
}

module.exports = {
  calculateFee,
  getCommunity,
  listCommunities,
  createCommunity,
  applyToJoin,
  reviewApplication,
  donateToCommunity,
  setStipendConfig,
  distributeStipends,
  getPlatformFeeInfo,
  PLATFORM_FEE_PERCENT,
};

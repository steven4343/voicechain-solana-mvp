const crypto = require("crypto");
const { PublicKey } = require("@solana/web3.js");

const users = new Map();

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

function findOrCreateUser(walletAddress, displayName) {
  let user = users.get(walletAddress);
  if (!user) {
    user = {
      walletAddress,
      displayName: displayName || `User_${walletAddress.slice(0, 4)}`,
      avatar: null,
      createdAt: Date.now(),
      lastLogin: Date.now(),
      totalDonations: 0,
      communitiesJoined: [],
    };
    users.set(walletAddress, user);
  } else {
    user.lastLogin = Date.now();
    if (displayName) user.displayName = displayName;
  }
  return user;
}

function getUserByWallet(walletAddress) {
  return users.get(walletAddress) || null;
}

async function login(data) {
  const { walletAddress, displayName, signature, message } = data;

  if (!walletAddress) {
    throw new Error("walletAddress is required");
  }

  try {
    new PublicKey(walletAddress);
  } catch {
    throw new Error("Invalid wallet address");
  }

  const user = findOrCreateUser(walletAddress, displayName);
  const token = generateToken();

  user.token = token;
  user.lastLogin = Date.now();

  return {
    token,
    user: {
      walletAddress: user.walletAddress,
      displayName: user.displayName,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      totalDonations: user.totalDonations,
      communitiesJoined: user.communitiesJoined,
    },
  };
}

async function authenticate(token) {
  if (!token) throw new Error("No token provided");
  for (const [wallet, user] of users.entries()) {
    if (user.token === token) {
      return {
        walletAddress: user.walletAddress,
        displayName: user.displayName,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        totalDonations: user.totalDonations,
        communitiesJoined: user.communitiesJoined,
      };
    }
  }
  throw new Error("Invalid token");
}

async function updateProfile(walletAddress, updates) {
  const user = users.get(walletAddress);
  if (!user) throw new Error("User not found");
  if (updates.displayName) user.displayName = updates.displayName;
  if (updates.avatar !== undefined) user.avatar = updates.avatar;
  return {
    walletAddress: user.walletAddress,
    displayName: user.displayName,
    avatar: user.avatar,
    createdAt: user.createdAt,
    lastLogin: user.lastLogin,
  };
}

function listUsers() {
  return Array.from(users.values()).map((u) => ({
    walletAddress: u.walletAddress,
    displayName: u.displayName,
    createdAt: u.createdAt,
    totalDonations: u.totalDonations,
  }));
}

module.exports = {
  login,
  authenticate,
  updateProfile,
  getUserByWallet,
  listUsers,
};

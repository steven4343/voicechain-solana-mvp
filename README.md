# VoiceChain - Web3 Security & Transparency Platform

Hackathon-ready MVP protecting Solana users from malicious transactions using AI risk analysis and voice alerts, with blockchain-based scholarship management.

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- Phantom or Solflare wallet

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your OPENROUTER_API_KEY
pnpm install
pnpm dev
```

The backend starts on `http://localhost:3001`.

### 2. Frontend

```bash
cd frontend
cp .env.example .env.local
pnpm install
pnpm add @solana/web3.js @solana/wallet-adapter-react @solana/wallet-adapter-wallets @solana/wallet-adapter-base @solana/wallet-adapter-react-ui
pnpm dev
```

The frontend starts on `http://localhost:3000`.

### 3. Demo

```bash
node scripts/demo.js
```

## Features

- **Wallet Connection** - Phantom & Solflare via Solana Wallet Adapter
- **Security Dashboard** - Balance, transaction monitoring, risk score
- **AI Transaction Analyzer** - OpenRouter-powered risk scoring (0-100)
- **Voice Security Alerts** - ElevenLabs TTS warnings for risky transactions
- **Scholarship Smart Contract** - Anchor-based Solana program for milestone funding
- **Analytics** - Risk history, transaction volume, security metrics
- **Chrome Extension** - Browser-level transaction monitoring

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, TypeScript, TailwindCSS |
| Blockchain | Solana, Anchor 0.29, @solana/web3.js |
| Backend | Node.js, Express |
| AI | OpenRouter API (Mistral 7B) |
| Voice | ElevenLabs TTS |
| Wallet | Phantom, Solflare |

## Project Structure

```
voicechain/
├── frontend/           # Next.js app
│   ├── pages/          # Routes
│   ├── components/     # UI components
│   ├── hooks/          # useRiskAnalyzer, useVoiceAlert, useSolanaConnection
│   ├── lib/            # solana.ts (connection utilities)
│   ├── context/        # AppContext, WalletContext
│   └── styles/         # globals.css (dark theme)
├── backend/            # Express API
│   ├── server.js       # Main server
│   ├── src/
│   │   ├── config/     # Environment config
│   │   └── services/   # solana.js (backend Solana service)
│   ├── ai-risk-engine/ # OpenRouter AI analysis
│   └── api/            # Scholarship API routes
├── programs/           # Anchor smart contracts
│   └── scholarship/    # Milestone-based scholarship (Rust)
├── extension/          # Chrome extension
├── scripts/            # Demo & test transactions
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check (includes Solana RPC status) |
| POST | `/api/risk/analyze` | Analyze transaction risk |
| POST | `/api/risk/voice-warning` | Generate voice warning |
| GET | `/api/analytics/risk-history` | Risk score history |
| GET | `/api/analytics/summary` | Analytics summary |
| GET | `/api/solana/health` | Solana RPC health (version, slot, block height) |
| GET | `/api/solana/balance/:address` | Get SOL balance for an address |
| GET | `/api/solana/transaction/:signature` | Get transaction details |
| GET | `/api/solana/account/:address` | Get account info |
| POST | `/api/solana/airdrop` | Request devnet airdrop `{address, amount}` |
| GET | `/api/solana/slot` | Current slot |
| GET | `/api/solana/epoch` | Current epoch info |
| GET | `/api/solana/signatures/:address` | Recent signatures for an address |

## Test Transactions

| Signature | Expected Risk | Description |
|-----------|--------------|-------------|
| `safe_tx_001` | Low (15) | Normal SOL transfer |
| `risky_tx_002` | Medium (55) | Unusual token approval |
| `malicious_tx_003` | Critical (91) | Known phishing address |

## Smart Contract

The Anchor scholarship program supports:
- **Initialize Scholarship** - Create scholarships with milestones
- **Donate** - Add funds to scholarship vault
- **Approve Milestone** - Committee members vote
- **Complete Milestone** - Admin marks complete
- **Withdraw Funds** - Student withdraws funded amounts

### Build & Deploy

```bash
cd programs/scholarship
anchor build
anchor deploy --provider.cluster devnet
```

Update program ID in `Anchor.toml` and `programs/scholarship/src/lib.rs`.

## Chrome Extension

1. Open `chrome://extensions`
2. Enable Developer mode
3. Load unpacked → select `voicechain/extension`

## Solana Connection

The project has a dedicated Solana connection layer split between frontend and backend:

### Frontend (`frontend/lib/solana.ts`)
- Singleton `Connection` with configurable commitment (default: `confirmed`)
- `getConnection(config?)` — create/reuse connection with optional override
- `checkConnectionHealth()` — verify RPC connectivity (version, slot, block height)
- `getBalance()`, `getLatestBlockhash()`, `confirmTransaction()` — common read operations
- `sendTransaction()`, `simulateTransaction()` — write operations
- `getSignaturesForAddress()`, `getTokenBalance()`, `getTransactionDetails()` — query helpers
- `getExplorerUrl()` — build Solana Explorer links per network
- `useSolanaConnection()` hook (`hooks/useSolanaConnection.ts`) — polls health every 30s

### Backend (`backend/src/services/solana.js`)
- Singleton `Connection` sourced from `config.solana`
- `checkHealth()` — returns version, slot, block height, and endpoint
- `getBalance()`, `getTransaction()`, `getAccountInfo()`, `getSignaturesForAddress()`
- `requestAirdrop()` — devnet faucet for testing
- PublicKey validation in API routes

### Configuration
| Variable | Default | Description |
|----------|---------|-------------|
| `SOLANA_NETWORK` | `devnet` | Cluster: `devnet`, `mainnet-beta`, or `testnet` |
| `SOLANA_RPC_URL` | Auto-resolved | Custom RPC endpoint override |
| `SOLANA_COMMITMENT` | `confirmed` | Commitment level (`processed`, `confirmed`, `finalized`) |
| `SOLANA_CONFIRM_TIMEOUT` | `60000` | Transaction confirmation timeout (ms) |

## Environment Variables

### Backend (.env)
| Variable | Description |
|----------|------------|
| `PORT` | Server port (default: 3001) |
| `OPENROUTER_API_KEY` | OpenRouter API key |
| `AI_MODEL` | Model (default: mistral-7b-instruct) |
| `SOLANA_NETWORK` | Solana cluster (devnet/mainnet-beta/testnet) |
| `SOLANA_RPC_URL` | Custom RPC endpoint |
| `SOLANA_COMMITMENT` | Commitment level |
| `SOLANA_CONFIRM_TIMEOUT` | Confirm timeout in ms |

### Frontend (.env.local)
| Variable | Description |
|----------|------------|
| `NEXT_PUBLIC_BACKEND_URL` | Backend URL |
| `NEXT_PUBLIC_ELEVENLABS_API_KEY` | ElevenLabs API key |
| `NEXT_PUBLIC_SOLANA_NETWORK` | Solana cluster |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | Custom RPC endpoint |

## Hackathon Demo Script

1. **Connect Wallet** - Click "Connect Wallet" → Phantom
2. **Dashboard** - Show balance, risk score, transactions
3. **Test Voice Alert** - Trigger high-risk tx to hear warning
4. **Analyze Transaction** - Test mock transactions
5. **Scholarships** - Browse scholarships and milestones
6. **Analytics** - View risk history and charts
7. **Chrome Extension** - Show popup with activity log

## Deployment

### Vercel
```bash
cd frontend
vercel --prod
```

### Solana Devnet
```bash
cd programs/scholarship
anchor deploy
```

## License

MIT

# VoiceChain - Web3 Security & Community Funding Platform

Hackathon-ready platform protecting Solana users from malicious transactions using AI risk analysis and voice alerts, with community-based funding, scholarship management, and milestone-based stipends.

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
| POST | `/api/tts/generate` | Generate TTS audio from text (returns MP3) |
| POST | `/api/tts/stream` | Stream TTS audio (chunked transfer) |
| POST | `/api/tts/analyze-and-speak` | Analyze transaction risk + return TTS audio |
| POST | `/api/real/tx/:signature/analyze` | Fetch real Solana tx + run risk analysis |
| GET | `/api/real/address/:address/risk` | Fetch real address risk profile |

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

## ElevenLabs Voice Security

Voice alerts are proxied through the backend to keep API keys secure, using ElevenLabs `eleven_flash_v2_5` for low-latency TTS.

### Backend (`backend/src/services/elevenlabs.js`)
- `generateSpeech()` — full TTS request, returns MP3 binary
- `generateSpeechStream()` — streaming TTS via `/stream` endpoint with `optimize_streaming_latency=3`
- `buildWarningText()` — generates severity-appropriate warning text (critical/high/medium)
- Voice settings tuned per severity: critical uses lower stability + higher style for urgency
- Falls back gracefully if API key is not configured

### Frontend (`frontend/hooks/useVoiceAlert.ts`)
- Routes all TTS through `POST /api/tts/generate` (keeps API key server-side)
- `speak(text)` — basic TTS via backend proxy
- `speakWithSeverity(text, severity)` — streaming TTS with severity-based voice tuning
- `analyzeAndSpeak(transactionData)` — single call: analyze risk + generate + play audio
- Falls back to browser `SpeechSynthesisUtterance` API if ElevenLabs is unavailable

### Voice per Severity
| Severity | Stability | Style | Speed | Effect |
|----------|-----------|-------|-------|--------|
| Critical | 0.3 | 0.4 | 0.95 | Urgent, tense delivery |
| High | 0.4 | 0.2 | 1.0 | Alert, slightly urgent |
| Medium/Low | 0.5 | 0 | 1.0 | Clear, neutral |

## Real Data Integration

### Backend (`backend/src/services/realData.js`)
- `getTransactionRisk(signature)` — fetches real Solana tx, runs AI risk analysis, returns warning text
- `getAddressRisk(address)` — analyzes address risk based on balance, tx count, failure rate, program diversity
- Both endpoints available via `/api/real/*`

### Flow
1. User submits a real Solana transaction signature
2. Backend fetches the transaction from Solana via RPC
3. Transaction data is passed to the AI risk analyzer
4. Risk score determines if a voice warning should play
5. Warning text + optional TTS audio is returned to the frontend

## Community Funding & Stipends

Communities are the core funding primitive. Donors fund communities, admins manage members, and members receive stipends.

### Roles
| Role | Permissions |
|------|-------------|
| **Admin** | Creates community, approves/rejects applications, configures stipends, distributes funds |
| **Member** | Receives stipends, can view community activity |
| **Donor** | Funds the community (external, no membership required) |
| **Applicant** | Applied to join, waiting for admin approval |

### Flow
1. **Create** — Anyone creates a community with a name, description, and funding goal
2. **Join** — Users apply with their name and reason; admin reviews and accepts/rejects
3. **Fund** — Donors contribute; a flat 2.5% platform fee is deducted automatically
4. **Stipend** — Admin configures recurring stipends (amount per member, frequency)
5. **Distribute** — Admin triggers distribution; stipends are sent to all active members
6. **Track** — Every donation, distribution, and fee is recorded on-chain

### Platform Fee Model
```
Donation:    $100.00
Fee (2.5%):  -$2.50  → VoiceChain Treasury
Net:          $97.50  → Community Wallet

Stipend Distribution (10 members @ $5):
Gross:       $50.00
Fee (2.5%):  -$1.25  → VoiceChain Treasury
Net:         $48.75  → $4.875 per member
```

**Key rules:**
- One flat percentage (2.5%) applied uniformly across all transactions
- Fee applies to both **donations** and **stipend distributions**
- Fee is transparently shown to users before they confirm
- Treasury wallet collects all fees to sustain the platform

### Community Pages
| Route | Purpose |
|-------|---------|
| `/communities` | Browse all communities, stats, create new |
| `/communities/[id]` | Community detail: donate, apply, member list, stipend admin |

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/community/fee-info` | Get platform fee configuration |
| POST | `/api/community/create` | Create a new community |
| GET | `/api/community/:id` | Get community details |
| GET | `/api/communities` | List all communities (with filters) |
| POST | `/api/community/:id/apply` | Apply to join a community |
| POST | `/api/community/:id/review-application` | Admin: approve/reject applicant |
| POST | `/api/community/:id/donate` | Donate to a community |
| POST | `/api/community/:id/set-stipend` | Configure stipend parameters |
| POST | `/api/community/:id/distribute-stipends` | Trigger stipend distribution |

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
| `ELEVENLABS_API_KEY` | ElevenLabs API key (server-side, not exposed to frontend) |
| `ELEVENLABS_MODEL` | TTS model (default: `eleven_flash_v2_5`) |
| `ELEVENLABS_VOICE_ID` | Voice ID (default: `pNInz6obpgDQGcFmaJgB`) |

### Frontend (.env.local)
| Variable | Description |
|----------|------------|
| `NEXT_PUBLIC_BACKEND_URL` | Backend URL |
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

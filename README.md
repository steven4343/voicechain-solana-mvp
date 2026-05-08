# VoiceChain - Web3 Security & Transparency Platform

A hackathon-ready MVP that protects Solana users from malicious transactions using AI-powered risk analysis and voice alerts, with blockchain-based scholarship management.

## Features

- **Wallet Connection** - Phantom & Solflare wallet support via Wallet Adapter
- **Security Dashboard** - Real-time balance, transaction monitoring, risk scores
- **AI Transaction Analyzer** - OpenRouter-powered risk scoring (0-100)
- **Voice Security Alerts** - ElevenLabs text-to-speech warnings for risky transactions
- **Scholarship Smart Contract** - Anchor-based Solana program for milestone-based funding
- **Analytics** - Risk history charts, transaction volume, security metrics
- **Chrome Extension** - Browser-level transaction monitoring and alerts

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js, React, TypeScript, TailwindCSS |
| Blockchain | Solana, Anchor Framework, @solana/web3.js |
| Backend | Node.js, Express |
| AI | OpenRouter API (Mistral 7B) |
| Voice | ElevenLabs TTS |
| Wallet | Phantom, Solflare |

## Project Structure

```
voicechain/
├── frontend/              # Next.js application
│   ├── pages/             # Routes (dashboard, scholarships, analytics)
│   ├── components/        # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   ├── context/           # Global state management
│   ├── wallet/            # Wallet adapter configuration
│   ├── types/             # TypeScript type definitions
│   └── styles/            # Global CSS and Tailwind
├── backend/               # Express API server
│   ├── api/               # API route handlers
│   └── ai-risk-engine/    # AI transaction risk analyzer
├── programs/              # Anchor smart contracts
│   └── scholarship/       # Scholarship program (Rust)
├── extension/             # Chrome extension
│   ├── manifest.json
│   ├── popup.html/js      # Extension popup UI
│   ├── content.js         # Content script for page monitoring
│   └── background.js      # Service worker for background tasks
└── README.md
```

## Quick Start

### Prerequisites

- Node.js 18+
- Rust + Cargo (for smart contract)
- Anchor CLI (`cargo install --git https://github.com/coral-xyz/anchor avm --locked`)
- Solana CLI (`sh -c "$(curl -sSfL https://release.solana.com/v1.17.0/install)"`)
- A Phantom or Solflare wallet

### 1. Backend Setup

```bash
cd voicechain/backend
cp .env.example .env
# Edit .env with your API keys
npm install
npm run dev
```

The backend will start on `http://localhost:3001`.

### 2. Frontend Setup

```bash
cd voicechain/frontend
cp .env.example .env.local
# Edit .env.local with your API keys
npm install
npm run dev
```

The frontend will start on `http://localhost:3000`.

### 3. Smart Contract (Optional)

```bash
cd voicechain/programs/scholarship
anchor build
anchor test
anchor deploy --provider.cluster devnet
```

Update the program ID in `Anchor.toml` and `programs/scholarship/src/lib.rs`.

### 4. Chrome Extension

1. Open Chrome and go to `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `voicechain/extension` folder

## Environment Variables

### Backend (.env)

| Variable | Description |
|----------|------------|
| `PORT` | Server port (default: 3001) |
| `OPENROUTER_API_KEY` | OpenRouter API key for AI analysis |
| `OPENROUTER_BASE_URL` | OpenRouter API base URL |
| `AI_MODEL` | AI model to use (default: mistral-7b-instruct) |

### Frontend (.env.local)

| Variable | Description |
|----------|------------|
| `NEXT_PUBLIC_BACKEND_URL` | Backend API URL |
| `NEXT_PUBLIC_ELEVENLABS_API_KEY` | ElevenLabs API key for voice alerts |
| `NEXT_PUBLIC_SOLANA_NETWORK` | Solana network (devnet/mainnet-beta) |

## API Endpoints

### Backend API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/risk/analyze` | Analyze transaction risk |
| POST | `/api/risk/voice-warning` | Generate voice warning |
| GET | `/api/analytics/risk-history` | Get risk score history |
| GET | `/api/analytics/summary` | Get analytics summary |

### Risk Analysis Request

```json
POST /api/risk/analyze
{
  "transactionData": {
    "destination": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    "amount": 2500000000,
    "programId": "11111111111111111111111111111111",
    "tokenTransfers": []
  },
  "walletAddress": "YourWalletAddress..."
}
```

### Risk Analysis Response

```json
{
  "riskScore": 87,
  "riskLevel": "high",
  "reasons": [
    "Destination address flagged in phishing database",
    "Unusual token approval pattern detected"
  ],
  "recommendation": "Do not proceed with this transaction",
  "timestamp": 1704067200000
}
```

## Test Transactions

Use these mock transaction signatures on the Analyzer page:

| Signature | Expected Risk | Description |
|-----------|--------------|-------------|
| `safe_tx_001` | Low (15) | Normal SOL transfer |
| `risky_tx_002` | Medium (55) | Unusual token approval |
| `malicious_tx_003` | Critical (91) | Known phishing address |

On the Dashboard, click **"Simulate High Risk Tx"** to trigger a voice alert.

## Smart Contract

The scholarship program supports:

- **Initialize Scholarship** - Create a new scholarship with milestones
- **Donate** - Add funds to a scholarship vault
- **Approve Milestone** - Committee members approve milestones
- **Complete Milestone** - Admin marks milestones as complete
- **Withdraw Funds** - Student withdraws funded amounts

### Accounts

- `ScholarshipAccount` - Stores scholarship details and funding
- `MilestoneAccount` - Individual milestone tracking

## Deployment

### Vercel (Frontend)

```bash
cd frontend
vercel --prod
```

Set environment variables in Vercel dashboard.

### Solana Devnet

```bash
cd programs/scholarship
solana config set --url devnet
anchor deploy
```

## Hackathon Demo Script

1. **Connect Wallet** - Click "Connect Wallet" and select Phantom
2. **Dashboard** - Show balance, transactions, and risk score
3. **Test Voice Alert** - Click "Simulate High Risk Tx" to hear warning
4. **Analyze Transaction** - Go to Analyzer page, test with mock transactions
5. **Scholarships** - Show scholarship list, click into details
6. **Analytics** - Display risk history and transaction charts
7. **Chrome Extension** - Show extension popup and settings

## License

MIT

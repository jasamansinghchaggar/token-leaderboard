# Token Leaderboard - Level 2 Stellar

A multi-wallet token leaderboard application with smart contract integration on Stellar Soroban testnet.

## Features

- Multi-wallet support (Stellar Wallets Kit)
- Real-time token holder rankings from Horizon API
- Soroban smart contract scaffolding
- Transaction status tracking
- Error handling for wallet issues

## Tech Stack

- **Frontend:** Next.js, TypeScript, Shadcn UI, Tailwind CSS
- **Wallet:** Stellar Wallets Kit
- **Smart Contract:** Soroban (Rust)
- **Data:** Stellar Horizon API

## Setup

### Prerequisites

- Node.js 18+
- Rust + Soroban CLI
- A Stellar testnet account

### Installation

```bash
npm install
cp .env.example .env
```

Update `.env` with your deployed contract ID.

### Run Development Server

```bash
npm run dev
```

Open `http://localhost:3000`.

### Build Contract

```bash
cd contracts/token-leaderboard
soroban contract build
```

### Deploy Contract (Testnet)

```bash
soroban config network add \
  --name testnet \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015"

soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/token_leaderboard.wasm \
  --source <your-public-key> \
  --network testnet
```

## Deployment Details (Fill After Deploy)

- **Live Demo:** `<vercel-link>`
- **Contract Address:** `<contract-address>`
- **Transaction Hash:** `<transaction-hash>`

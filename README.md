# MSK DAO - Mars Society Kenya Decentralized Autonomous Organization

## Overview

MSK DAO is a comprehensive decentralized governance platform built to accelerate space exploration research, education, and advocacy within Kenya and East Africa. The platform implements multi-chain blockchain technology with strategic integration of Bitcoin, Ethereum, Solana, Tether, and Dogecoin.

## Architecture

### Multi-Crypto Integration Strategy

#### 1. **Bitcoin (BTC) - Reserve/Cold Storage**
- **Purpose**: Long-term value preservation and treasury reserves
- **Integration**: Via Stacks (Bitcoin L2 smart contracts)
- **Use Cases**:
  - Strategic treasury holdings
  - Long-term investment reserves
  - Institutional-grade security

#### 2. **Ethereum (ETH) - Governance & Smart Contracts**
- **Purpose**: On-chain governance mechanisms and smart contract execution
- **Integration**: Native smart contracts + soulbound tokens (ERC-4973)
- **Use Cases**:
  - Governance token contracts
  - Treasury management contracts
  - Voting mechanisms
  - Quadratic voting implementation

#### 3. **Solana (SOL) - High-Speed Transactions**
- **Purpose**: Real-time member rewards and microtransactions
- **Integration**: Native Solana program architecture
- **Use Cases**:
  - Instant member rewards distribution
  - Activity tracking and rewards
  - Real-time microtransactions
  - Low-fee operations

#### 4. **Tether (USDT) - Operational Treasury**
- **Purpose**: Stablecoin for operational expenses and budgeting
- **Integration**: Multi-chain deployment (Ethereum, Polygon, Solana)
- **Use Cases**:
  - Project budgets
  - Operational expenses
  - Vendor payments
  - Price consistency

#### 5. **Dogecoin (DOGE) - Community Engagement**
- **Purpose**: Community rewards, badges, and gamification
- **Integration**: Via atomic swaps and bridge protocols
- **Use Cases**:
  - Community member badges
  - Achievement rewards
  - Social engagement incentives
  - Community tipping system

## Project Structure

```
msk-dao/
├── packages/
│   ├── backend/           # Express.js API server
│   │   ├── src/
│   │   │   ├── config/    # Blockchain & Database config
│   │   │   ├── models/    # MongoDB schemas
│   │   │   ├── routes/    # API endpoints
│   │   │   ├── services/  # Business logic
│   │   │   └── utils/     # Utilities
│   │   └── package.json
│   ├── frontend/          # Next.js React application
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── styles/
│   │   └── package.json
│   └── smart-contracts/   # Solidity smart contracts
│       ├── contracts/
│       ├── scripts/
│       └── hardhat.config.js
├── turbo.json             # Monorepo configuration
├── package.json           # Root package.json
└── docker-compose.yml     # Local development setup
```

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB
- **Cache**: Redis
- **Blockchain**: ethers.js, @solana/web3.js
- **API Client**: Axios

### Frontend
- **Framework**: Next.js (React 18)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Data Fetching**: React Query
- **Web3**: ethers.js, @solana/wallet-adapter

### Smart Contracts
- **Language**: Solidity 0.8.20
- **Framework**: Hardhat
- **Standard**: OpenZeppelin Contracts
- **Features**: ERC-721 (soulbound), ERC-20 (governance)

## Key Features

### 1. Governance Module
- **Quadratic Voting**: Uses √(contribution_credits) for voting power
- **Proposal System**: Create, vote, and execute proposals
- **Quorum Management**: 30% minimum participation requirement
- **Soulbound Tokens**: Non-transferable contribution credentials

### 2. Treasury Management
- **Multi-Crypto**: BTC, ETH, SOL, USDT, DOGE balances
- **Multi-Chain**: Ethereum, Polygon, Solana, Stacks, Base
- **Transaction Logging**: All transactions recorded on-chain
- **Spending Limits**: Council approval for expenses < $500
- **Transparency**: Quarterly Mission Financial Reports

### 3. Member System
- **Contribution Credits**: Earned through:
  - Peer-reviewed research contributions
  - Logistical support for missions
  - Mentorship of junior scientists
- **Member Profiles**: Wallet integration, analytics, rewards tracking
- **Role-Based Access**: Member, Council, Admin tiers

### 4. Project Management
- **Categories**: Research, Education, Mission, Advocacy
- **Budget Tracking**: USDT, SOL, ETH denominated budgets
- **Milestone Tracking**: Timeline management and completion tracking
- **Impact Measurement**: Expected vs actual outcomes

### 5. AI Integration
- **Member Recommendations**: OpenAI-powered personalized suggestions
- **Analytics**: Contribution scoring and engagement metrics
- **Predictive Insights**: Projected rewards and performance trends

## Getting Started

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/mashizaq/msk-dao.git
   cd msk-dao
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp packages/backend/.env.example packages/backend/.env
   cp packages/frontend/.env.example packages/frontend/.env
   ```

4. **Start local services**
   ```bash
   docker-compose up -d
   ```

5. **Run development servers**
   ```bash
   npm run dev
   ```

### Accessing the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: mongodb://localhost:27017
- Redis: redis://localhost:6379

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify` - Verify JWT token

### Members
- `GET /api/members` - List all members
- `GET /api/members/:id` - Get member details
- `PATCH /api/members/:id` - Update member profile

### Governance
- `GET /api/governance/proposals` - List proposals
- `POST /api/governance/proposals` - Create proposal
- `POST /api/governance/proposals/:id/vote` - Vote on proposal
- `GET /api/governance/voting-power/:userId` - Get voting power

### Treasury
- `GET /api/treasury/balances` - Get all balances
- `GET /api/treasury/transactions` - List transactions
- `POST /api/treasury/transactions` - Log transaction

### Projects
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `PATCH /api/projects/:id` - Update project

### Blockchain
- `GET /api/blockchain/ethereum/balance/:address` - Get ETH balance
- `GET /api/blockchain/solana/balance/:publicKey` - Get SOL balance
- `GET /api/blockchain/networks` - Get network info

## Smart Contract Deployment

### Sepolia Testnet
```bash
cd packages/smart-contracts
npm run deploy:sepolia
```

### Polygon Mumbai
```bash
npm run deploy:polygon
```

### Base Sepolia
```bash
npm run deploy:base
```

## Configuration

### Environment Variables

See `.env.example` files in `packages/backend` and `packages/frontend` for complete configuration options.

Key variables:
- `ETHEREUM_RPC_URL` - Ethereum RPC endpoint
- `SOLANA_RPC_URL` - Solana RPC endpoint
- `MONGODB_URI` - MongoDB connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - JWT signing secret
- `OPENAI_API_KEY` - OpenAI API for AI features

## Security Considerations

1. **Private Keys**: Never commit private keys to version control
2. **Environment Variables**: Use `.env` files (excluded from git)
3. **Rate Limiting**: All API endpoints have rate limiting
4. **CORS**: Configure allowed origins in production
5. **Smart Contracts**: Audited and tested (recommended before mainnet)

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add your feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or suggestions:
- GitHub Issues: https://github.com/mashizaq/msk-dao/issues
- Documentation: See `/docs` directory
- Email: support@mskdao.org

## Roadmap

- [ ] Phase 1: Core governance and treasury (Current)
- [ ] Phase 2: AI-powered recommendations
- [ ] Phase 3: Mobile application
- [ ] Phase 4: Advanced DeFi integrations
- [ ] Phase 5: Cross-chain bridges
- [ ] Phase 6: Mainnet deployment

---

**Built with ❤️ for the Mars Society Kenya and the future of space exploration**

# 1zn0z Smart Contract Suite

## Overview
This project contains a suite of smart contracts for the 1zn0z ecosystem, including Token, DAO, Contributor Pool, and Progressive Decentralization contracts.

## Prerequisites
- Node.js (v18+)
- npm or yarn
- Hardhat

## Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your credentials

## Deployment

### Local Development
```bash
npx hardhat node  # Start local blockchain
npx hardhat run scripts/deploy.js --network localhost
```

### Testnet Deployment
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### Mainnet Deployment
```bash
npx hardhat run scripts/deploy.js --network mainnet
```

## Continuous Deployment
This project uses GitHub Actions for automated deployment:
- Pushes to `develop` branch deploy to Sepolia testnet
- Pushes to `main` branch deploy to Ethereum mainnet

## Environment Variables
- `ETHEREUM_PRIVATE_KEY`: Your Ethereum wallet private key
- `INFURA_PROJECT_ID`: Infura project ID for network access
- `ETHERSCAN_API_KEY`: Optional, for contract verification

## Security
- Never commit private keys
- Use hardware wallets for mainnet deployments
- Rotate keys regularly

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and create a Pull Request

## License
MIT License

## Disclaimer
Cryptocurrency investments carry inherent risks. Participate responsibly.

## Contact & Community
- Discord: [Your Discord Link]
- Twitter: [Your Twitter Handle]
- Email: [Your Contact Email]

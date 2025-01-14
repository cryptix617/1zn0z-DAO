require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID || "";
const SEPOLIA_WALLET_ADDRESS = process.env.SEPOLIA_WALLET_ADDRESS || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    mainnet: {
      url: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: process.env.ETHEREUM_PRIVATE_KEY ? [process.env.ETHEREUM_PRIVATE_KEY] : [],
      chainId: 1
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: process.env.SEPOLIA_PRIVATE_KEY ? [process.env.SEPOLIA_PRIVATE_KEY] : [],
      chainId: 11155111,
      from: SEPOLIA_WALLET_ADDRESS
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === 'true',
    currency: "USD"
  }
};

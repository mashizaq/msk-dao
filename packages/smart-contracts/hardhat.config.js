require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

module.exports = {
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    sepolia: {
      url: process.env.ETHEREUM_RPC_URL,
      accounts: [process.env.ETHEREUM_PRIVATE_KEY],
    },
    polygonMumbai: {
      url: process.env.POLYGON_RPC_URL,
      accounts: [process.env.ETHEREUM_PRIVATE_KEY],
    },
    baseSepolia: {
      url: process.env.BASE_RPC_URL,
      accounts: [process.env.ETHEREUM_PRIVATE_KEY],
    },
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
};

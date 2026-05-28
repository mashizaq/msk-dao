import { ethers } from 'ethers';
import * as web3 from '@solana/web3.js';
import { logger } from '../utils/logger';

interface BlockchainConfig {
  ethereum: {
    provider: ethers.JsonRpcProvider;
    signer?: ethers.Wallet;
    chainId: number;
  };
  solana: {
    connection: web3.Connection;
    keypair?: web3.Keypair;
  };
  stacks: {
    apiUrl: string;
    network: string;
  };
  polygon: {
    provider: ethers.JsonRpcProvider;
    chainId: number;
  };
  base: {
    provider: ethers.JsonRpcProvider;
    chainId: number;
  };
}

let config: BlockchainConfig;

export async function initializeBlockchain(): Promise<BlockchainConfig> {
  try {
    // Ethereum Configuration
    const ethereumProvider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
    const ethereumSigner = process.env.ETHEREUM_PRIVATE_KEY
      ? new ethers.Wallet(process.env.ETHEREUM_PRIVATE_KEY, ethereumProvider)
      : undefined;

    // Solana Configuration
    const solanaConnection = new web3.Connection(
      process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
      'confirmed'
    );
    const solanaKeypair = process.env.SOLANA_PRIVATE_KEY
      ? web3.Keypair.fromSecretKey(
          Buffer.from(process.env.SOLANA_PRIVATE_KEY.split(',').map(Number))
        )
      : undefined;

    // Polygon Configuration
    const polygonProvider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL);

    // Base Configuration
    const baseProvider = new ethers.JsonRpcProvider(process.env.BASE_RPC_URL);

    config = {
      ethereum: {
        provider: ethereumProvider,
        signer: ethereumSigner,
        chainId: parseInt(process.env.ETHEREUM_CHAIN_ID || '11155111'),
      },
      solana: {
        connection: solanaConnection,
        keypair: solanaKeypair,
      },
      stacks: {
        apiUrl: process.env.STACKS_API_URL || 'https://api.testnet.hiro.so',
        network: process.env.NODE_ENV === 'production' ? 'mainnet' : 'testnet',
      },
      polygon: {
        provider: polygonProvider,
        chainId: parseInt(process.env.POLYGON_CHAIN_ID || '80001'),
      },
      base: {
        provider: baseProvider,
        chainId: parseInt(process.env.BASE_CHAIN_ID || '84532'),
      },
    };

    logger.info('Blockchain configuration initialized');
    return config;
  } catch (error) {
    logger.error('Blockchain initialization failed:', error);
    throw error;
  }
}

export function getBlockchainConfig(): BlockchainConfig {
  if (!config) {
    throw new Error('Blockchain not initialized. Call initializeBlockchain() first.');
  }
  return config;
}

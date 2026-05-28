import express, { Router, Request, Response } from 'express';
import { ethers } from 'ethers';
import * as web3 from '@solana/web3.js';
import { getBlockchainConfig } from '../config/blockchain';
import { logger } from '../utils/logger';

const router: Router = express.Router();

// Get Ethereum balance
router.get('/ethereum/balance/:address', async (req: Request, res: Response) => {
  try {
    const config = getBlockchainConfig();
    const balance = await config.ethereum.provider.getBalance(req.params.address);
    res.json({ address: req.params.address, balance: ethers.formatEther(balance), raw: balance.toString() });
  } catch (error) {
    logger.error('Error fetching Ethereum balance:', error);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

// Get Solana balance
router.get('/solana/balance/:publicKey', async (req: Request, res: Response) => {
  try {
    const config = getBlockchainConfig();
    const publicKey = new web3.PublicKey(req.params.publicKey);
    const balance = await config.solana.connection.getBalance(publicKey);
    res.json({ publicKey: req.params.publicKey, balance, balanceSOL: balance / web3.LAMPORTS_PER_SOL });
  } catch (error) {
    logger.error('Error fetching Solana balance:', error);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

// Get network info
router.get('/networks', async (req: Request, res: Response) => {
  try {
    const config = getBlockchainConfig();
    const networks = {
      ethereum: {
        chainId: config.ethereum.chainId,
        rpcUrl: process.env.ETHEREUM_RPC_URL,
        name: 'Ethereum Sepolia',
      },
      solana: {
        cluster: 'devnet',
        rpcUrl: process.env.SOLANA_RPC_URL,
        name: 'Solana Devnet',
      },
      polygon: {
        chainId: config.polygon.chainId,
        rpcUrl: process.env.POLYGON_RPC_URL,
        name: 'Polygon Mumbai',
      },
      base: {
        chainId: config.base.chainId,
        rpcUrl: process.env.BASE_RPC_URL,
        name: 'Base Sepolia',
      },
      stacks: {
        network: config.stacks.network,
        apiUrl: config.stacks.apiUrl,
        name: 'Stacks Bitcoin L2',
      },
    };
    res.json(networks);
  } catch (error) {
    logger.error('Error fetching network info:', error);
    res.status(500).json({ error: 'Failed to fetch network info' });
  }
});

export default router;

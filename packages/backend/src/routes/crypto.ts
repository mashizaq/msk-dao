import express, { Router, Request, Response } from 'express';
import { cryptoService } from '../services/crypto/CryptoService';
import { logger } from '../utils/logger';

const router: Router = express.Router();

// Get all crypto prices
router.get('/prices', async (req: Request, res: Response) => {
  try {
    const prices = await cryptoService.getPrices();
    res.json(prices);
  } catch (error) {
    logger.error('Error fetching prices:', error);
    res.status(500).json({ error: 'Failed to fetch prices' });
  }
});

// Convert amount to USD
router.post('/convert-to-usd', async (req: Request, res: Response) => {
  try {
    const { amount, currency } = req.body;

    if (!amount || !currency) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const usdValue = await cryptoService.convertToUSD(amount, currency);
    res.json({ amount, currency, usdValue });
  } catch (error) {
    logger.error('Error converting to USD:', error);
    res.status(500).json({ error: 'Failed to convert' });
  }
});

// Get balance for Ethereum address
router.get('/ethereum/balance/:address', async (req: Request, res: Response) => {
  try {
    const balance = await cryptoService.getEthereumBalance(req.params.address);
    res.json({ address: req.params.address, balance });
  } catch (error) {
    logger.error('Error fetching Ethereum balance:', error);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

// Get balance for Solana public key
router.get('/solana/balance/:publicKey', async (req: Request, res: Response) => {
  try {
    const balance = await cryptoService.getSolanaBalance(req.params.publicKey);
    res.json({ publicKey: req.params.publicKey, balance });
  } catch (error) {
    logger.error('Error fetching Solana balance:', error);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

// Get token balance
router.post('/token/balance', async (req: Request, res: Response) => {
  try {
    const { tokenAddress, walletAddress, chain } = req.body;

    if (!tokenAddress || !walletAddress) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const balance = await cryptoService.getTokenBalance(
      tokenAddress,
      walletAddress,
      chain || 'ethereum'
    );
    res.json({ tokenAddress, walletAddress, balance });
  } catch (error) {
    logger.error('Error fetching token balance:', error);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

export default router;

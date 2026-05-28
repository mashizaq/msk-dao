import express, { Router, Request, Response } from 'express';
import { TreasuryBalance, TreasuryTransaction } from '../models/Treasury';
import { logger } from '../utils/logger';

const router: Router = express.Router();

// Get all balances
router.get('/balances', async (req: Request, res: Response) => {
  try {
    const balances = await TreasuryBalance.find();
    const summary = {
      BTC: 0,
      ETH: 0,
      SOL: 0,
      USDT: 0,
      DOGE: 0,
      balances,
    };

    balances.forEach((b: any) => {
      summary[b.currency as keyof typeof summary] = b.balance;
    });

    res.json(summary);
  } catch (error) {
    logger.error('Error fetching treasury balances:', error);
    res.status(500).json({ error: 'Failed to fetch balances' });
  }
});

// Get transactions
router.get('/transactions', async (req: Request, res: Response) => {
  try {
    const { currency, status } = req.query;
    const filter: any = {};
    
    if (currency) filter.currency = currency;
    if (status) filter.status = status;

    const transactions = await TreasuryTransaction.find(filter)
      .populate('approvedBy', 'username')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(transactions);
  } catch (error) {
    logger.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Log transaction
router.post('/transactions', async (req: Request, res: Response) => {
  try {
    const {
      type,
      currency,
      chain,
      amount,
      fromAddress,
      toAddress,
      txHash,
      approvedBy,
    } = req.body;

    if (!type || !currency || !chain || !amount || !fromAddress || !toAddress || !txHash) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const transaction = new TreasuryTransaction({
      type,
      currency,
      chain,
      amount,
      fromAddress,
      toAddress,
      txHash,
      approvedBy,
      status: 'pending',
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    logger.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

export default router;

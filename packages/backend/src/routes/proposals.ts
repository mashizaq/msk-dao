import express, { Router, Request, Response } from 'express';
import { Proposal } from '../models/Proposal';
import { logger } from '../utils/logger';

const router: Router = express.Router();

// Get proposal by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const proposal = await Proposal.findById(req.params.id).populate('author', 'username email');
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    res.json(proposal);
  } catch (error) {
    logger.error('Error fetching proposal:', error);
    res.status(500).json({ error: 'Failed to fetch proposal' });
  }
});

// Update proposal status
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    if (!['draft', 'active', 'passed', 'rejected', 'executed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const proposal = await Proposal.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    );

    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    res.json(proposal);
  } catch (error) {
    logger.error('Error updating proposal status:', error);
    res.status(500).json({ error: 'Failed to update proposal' });
  }
});

export default router;

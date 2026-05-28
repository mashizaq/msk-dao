import express, { Router, Request, Response } from 'express';
import { Proposal } from '../models/Proposal';
import { User } from '../models/User';
import { logger } from '../utils/logger';

const router: Router = express.Router();

// Get all proposals
router.get('/proposals', async (req: Request, res: Response) => {
  try {
    const { status, category } = req.query;
    const filter: any = {};
    
    if (status) filter.status = status;
    if (category) filter.category = category;

    const proposals = await Proposal.find(filter)
      .populate('author', 'username email')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(proposals);
  } catch (error) {
    logger.error('Error fetching proposals:', error);
    res.status(500).json({ error: 'Failed to fetch proposals' });
  }
});

// Create proposal
router.post('/proposals', async (req: Request, res: Response) => {
  try {
    const { title, description, author, category } = req.body;

    if (!title || !description || !author || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const proposal = new Proposal({
      title,
      description,
      author,
      category,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    await proposal.save();
    res.status(201).json(proposal);
  } catch (error) {
    logger.error('Error creating proposal:', error);
    res.status(500).json({ error: 'Failed to create proposal' });
  }
});

// Vote on proposal
router.post('/proposals/:id/vote', async (req: Request, res: Response) => {
  try {
    const { userId, vote } = req.body; // vote: 'for', 'against', 'abstain'

    if (!vote || !['for', 'against', 'abstain'].includes(vote)) {
      return res.status(400).json({ error: 'Invalid vote' });
    }

    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const votingPower = Math.sqrt(user.governance.votingPower);

    if (vote === 'for') {
      proposal.votesFor += votingPower;
    } else if (vote === 'against') {
      proposal.votesAgainst += votingPower;
    } else {
      proposal.votesAbstain += votingPower;
    }

    await proposal.save();
    res.json(proposal);
  } catch (error) {
    logger.error('Error voting on proposal:', error);
    res.status(500).json({ error: 'Failed to vote on proposal' });
  }
});

// Get voting power
router.get('/voting-power/:userId', async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const votingPower = Math.sqrt(user.contributionCredits);
    res.json({ votingPower, contributionCredits: user.contributionCredits });
  } catch (error) {
    logger.error('Error fetching voting power:', error);
    res.status(500).json({ error: 'Failed to fetch voting power' });
  }
});

export default router;

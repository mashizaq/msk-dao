import express, { Router, Request, Response } from 'express';
import { User } from '../models/User';
import { logger } from '../utils/logger';

const router: Router = express.Router();

// Get all members
router.get('/', async (req: Request, res: Response) => {
  try {
    const members = await User.find().select('-passwordHash').limit(100);
    res.json(members);
  } catch (error) {
    logger.error('Error fetching members:', error);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// Get member by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const member = await User.findById(req.params.id).select('-passwordHash');
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    logger.error('Error fetching member:', error);
    res.status(500).json({ error: 'Failed to fetch member' });
  }
});

// Update member profile
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { profile, solanaPubkey, stacksAddress } = req.body;
    
    const member = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          profile,
          solanaPubkey,
          stacksAddress,
        },
      },
      { new: true }
    ).select('-passwordHash');

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json(member);
  } catch (error) {
    logger.error('Error updating member:', error);
    res.status(500).json({ error: 'Failed to update member' });
  }
});

export default router;

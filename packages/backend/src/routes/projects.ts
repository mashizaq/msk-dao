import express, { Router, Request, Response } from 'express';
import { Project } from '../models/Project';
import { logger } from '../utils/logger';

const router: Router = express.Router();

// Get all projects
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, category } = req.query;
    const filter: any = {};
    
    if (status) filter.status = status;
    if (category) filter.category = category;

    const projects = await Project.find(filter)
      .populate('lead', 'username email')
      .populate('team', 'username')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(projects);
  } catch (error) {
    logger.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Create project
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description, category, lead } = req.body;

    if (!name || !description || !category || !lead) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const project = new Project({
      name,
      description,
      category,
      lead,
      timeline: {
        startDate: new Date(),
      },
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    logger.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update project
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )
      .populate('lead', 'username')
      .populate('team', 'username');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    logger.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

export default router;

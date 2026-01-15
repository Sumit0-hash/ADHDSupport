import express, { Router, Request, Response } from 'express';
import { expertTalkService } from '../services/expertTalkService.js';

const router: Router = express.Router();

// GET /api/expert-talks
router.get('/', async (_req: Request, res: Response) => {
  try {
    const talks = await expertTalkService.getAll();
    res.json(talks);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /api/expert-talks
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, youtubeLink } = req.body;

    if (!title || !youtubeLink) {
      return res.status(400).json({ error: 'title and youtubeLink are required' });
    }

    const created = await expertTalkService.create(title, youtubeLink);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// DELETE /api/expert-talks/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const ok = await expertTalkService.delete(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;

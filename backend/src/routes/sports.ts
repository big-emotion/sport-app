import { Router, Request, Response } from 'express';
import { SportService } from '../services/SportService';
import { authenticateToken, requireRoles } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { createSportSchema, updateSportSchema } from '../validation/sportSchemas';

const router = Router();
const sportService = new SportService();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { search } = req.query;
    
    let sports;
    if (search) {
      sports = await sportService.search(search as string);
    } else {
      sports = await sportService.getAll();
    }
    
    res.json(sports);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const sport = await sportService.getById(id);
    
    if (!sport) {
      res.status(404).json({ error: 'Sport not found' });
      return;
    }
    
    res.json(sport);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', 
  authenticateToken, 
  requireRoles(['ROLE_ADMIN']), 
  validate(createSportSchema), 
  async (req: Request, res: Response): Promise<void> => {
    try {
      const sport = await sportService.create(req.body);
      res.status(201).json(sport);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.put('/:id', 
  authenticateToken, 
  requireRoles(['ROLE_ADMIN']), 
  validate(updateSportSchema), 
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      const existingSport = await sportService.getById(id);
      if (!existingSport) {
        res.status(404).json({ error: 'Sport not found' });
        return;
      }
      
      const sport = await sportService.update(id, req.body);
      res.json(sport);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.delete('/:id', 
  authenticateToken, 
  requireRoles(['ROLE_ADMIN']), 
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      const existingSport = await sportService.getById(id);
      if (!existingSport) {
        res.status(404).json({ error: 'Sport not found' });
        return;
      }
      
      await sportService.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
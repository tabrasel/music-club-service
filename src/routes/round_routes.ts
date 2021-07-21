// Import modules
import { Request, Response, Router } from 'express';

// Import model
import { RoundModel } from '../models/RoundModel';

const router: Router = Router();

// Create a new round
router.post('/api/round', (req: Request, res: Response) => {
  return RoundModel.createRound(req, res);
});

// Get a round
router.get('/api/round', (req: any, res: Response) => {
  if ('id' in req.query || 'number' in req.query) {
    return RoundModel.getRound(req, res);
  }

  res.status(400);
  res.json('Missing required args: [id] or [number]');
});

export default router;
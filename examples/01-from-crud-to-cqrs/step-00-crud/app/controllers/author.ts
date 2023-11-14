import Router from 'express-promise-router';
import { Request, Response } from 'express';

const router = Router();

// Create.
router.post('/', async (req: Request, res: Response) => {
  res.json({ id: 1 });
});

// Read (All).
router.get('/', async (req: Request, res: Response) => {
  res.json([]);
});

// Read (One).

router.get('/:id', async (req: Request<{id: number}>, res: Response) => {
  res.json({});
});

// Update.

router.put('/:id', async (req: Request<{id: number}>, res: Response) => {
  res.json({});
});

// Delete.

router.delete('/:id', async (req: Request<{id: number}>, res: Response) => {
  res.json({});
});

export const AuthorController = router;

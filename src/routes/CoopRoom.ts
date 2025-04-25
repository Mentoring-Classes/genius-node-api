import { createRoom, getRoom, joinRoom } from '../controllers/CoopRoom';
import { Request, Response, Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/coopRoom/create', authMiddleware,(req: Request, res: Response) => { createRoom(req, res); });
router.get('/coopRoom/:id', authMiddleware,(req: Request, res: Response) => { getRoom(req, res); });
router.patch('/coopRoom/join', authMiddleware,(req: Request, res: Response) => { joinRoom(req, res); });

export default router;
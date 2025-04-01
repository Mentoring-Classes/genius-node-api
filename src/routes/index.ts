import { Router } from 'express';
import userRoutes from './User';
import rankRoutes from './Rank';

const router = Router();

router.use(userRoutes);
router.use(rankRoutes);

export default router;

import { Router } from 'express';
import userRoutes from './User';
import rankRoutes from './Rank';
import coopRoomRoutes from './CoopRoom';

const router = Router();

router.use(userRoutes);
router.use(rankRoutes);
router.use(coopRoomRoutes)

export default router;

import { Router } from 'express';
import { waitingRoom } from '../controllers/waitingRoom';

const router = Router();

router.get('/listUsers', waitingRoom);

export default router;
import { Router } from 'express';
import waitingRoom from '../routes/waitingRoom';
import chat from '../routes/chat';

const router = Router();

router.use(waitingRoom);
router.use(chat);


export default router;
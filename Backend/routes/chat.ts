import { Router } from 'express';
import { getMessages } from '../controllers/chat';

const router = Router();

router.get('/', getMessages);

export default router;
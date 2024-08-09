import { Router } from 'express';
import { createUser } from '../controllers/chat';

const router = Router();

/* router.get('/', getMessages); */
router.post('/createUser', createUser);

export default router;
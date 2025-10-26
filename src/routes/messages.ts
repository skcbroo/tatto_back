import { Router } from 'express';
import { messageController } from '../controllers/messageController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, messageController.create);
router.get('/my-messages', authenticate, messageController.getMyMessages);
router.get('/conversation/:userId', authenticate, messageController.getConversation);
router.patch('/:id/read', authenticate, messageController.markAsRead);

export default router;

import { Router } from 'express';
import { artistController } from '../controllers/artistController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.get('/', artistController.getAll);
router.get('/my-profile', authenticate, authorizeRoles('artist'), artistController.getMyProfile);
router.get('/:id', artistController.getById);
router.put('/profile', authenticate, authorizeRoles('artist'), artistController.updateProfile);

export default router;

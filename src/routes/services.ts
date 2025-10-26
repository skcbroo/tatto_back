import { Router } from 'express';
import { serviceController } from '../controllers/serviceController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, authorizeRoles('artist'), serviceController.create);
router.get('/artist/:artistId', serviceController.getByArtistId);
router.put('/:id', authenticate, authorizeRoles('artist'), serviceController.update);
router.delete('/:id', authenticate, authorizeRoles('artist'), serviceController.delete);

export default router;

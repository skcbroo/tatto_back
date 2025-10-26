import { Router } from 'express';
import { favoriteController } from '../controllers/favoriteController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, favoriteController.add);
router.get('/my-favorites', authenticate, favoriteController.getMyFavorites);
router.delete('/:artistId', authenticate, favoriteController.remove);

export default router;

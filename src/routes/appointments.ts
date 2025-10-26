import { Router } from 'express';
import { appointmentController } from '../controllers/appointmentController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, appointmentController.create);
router.get('/my-appointments', authenticate, appointmentController.getMyAppointments);
router.get('/:id', authenticate, appointmentController.getById);
router.patch('/:id/status', authenticate, appointmentController.updateStatus);
router.delete('/:id', authenticate, appointmentController.delete);

export default router;

import { Router } from 'express';
import userController from '../controllers/user';

const router = Router();

router.post('/bookings/reserve', (req, res, next) => userController.reserve(req, res, next));
router.get('/bookings', (req, res, next) => userController.getAllBookings(req, res, next));


export default router;
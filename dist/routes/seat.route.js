import express from 'express';
import { seatController } from '../controllers';
const router = express.Router();
router.get('/trip/:id', seatController.getSeatsByTrip);
router.post('/reserve', seatController.reserveSeat);
export default router;

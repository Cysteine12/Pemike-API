import express from 'express';
import { paymentController } from '../controllers';
const router = express.Router();
router.get('/:id', paymentController.getPayment);
router.post('/initialize-payment', paymentController.initializePayment);
router.post('/verify-payment/:reference', paymentController.verifyPayment);
export default router;

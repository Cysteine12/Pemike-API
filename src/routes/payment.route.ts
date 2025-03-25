import express from 'express'
import { paymentController } from '../controllers'

const router = express.Router()

router.post('/initialize-payment', paymentController.initializePayment)

export default router

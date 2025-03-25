import express from 'express'
import { bookingController } from '../controllers'

const router = express.Router()

router.post('/', bookingController.createBooking)

export default router

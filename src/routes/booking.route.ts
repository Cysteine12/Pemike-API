import express from 'express'
import { bookingController } from '../controllers'
import passport from 'passport'

const router = express.Router()

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  bookingController.createBooking
)

export default router

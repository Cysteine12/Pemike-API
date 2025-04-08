import express from 'express'
import { bookingController } from '../controllers'
import passport from 'passport'
import { authorize } from '../middlewares/authorize'

const router = express.Router()

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  authorize(['CUSTOMER']),
  bookingController.getBookings
)

router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  authorize(['CUSTOMER']),
  bookingController.getBooking
)

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  authorize(['CUSTOMER']),
  bookingController.createBooking
)

export default router

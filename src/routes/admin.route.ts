import express from 'express'
import { adminController } from '../controllers'
import passport from 'passport'
import { authorize } from '../middlewares/authorize'

const router = express.Router()

router.get(
  '/users',
  passport.authenticate('jwt', { session: false }),
  authorize(['ADMIN']),
  adminController.getUsers
)

router.get(
  '/users/:id',
  passport.authenticate('jwt', { session: false }),
  authorize(['ADMIN']),
  adminController.getUser
)

router.patch(
  '/users/role',
  passport.authenticate('jwt', { session: false }),
  authorize(['ADMIN']),
  adminController.updateRole
)

router.post(
  '/trips',
  passport.authenticate('jwt', { session: false }),
  authorize(['ADMIN']),
  adminController.createTrip
)

router.patch(
  '/trips/:id',
  passport.authenticate('jwt', { session: false }),
  authorize(['ADMIN']),
  adminController.updateTrip
)

router.delete(
  '/trips/:id',
  passport.authenticate('jwt', { session: false }),
  authorize(['ADMIN']),
  adminController.deleteTrip
)

router.get(
  '/seats/:id',
  passport.authenticate('jwt', { session: false }),
  authorize(['ADMIN']),
  adminController.getSeats
)

router.post(
  '/seats',
  passport.authenticate('jwt', { session: false }),
  authorize(['ADMIN']),
  adminController.reserveSeats
)

router.get(
  '/boookings',
  passport.authenticate('jwt', { session: false }),
  authorize(['ADMIN']),
  adminController.getBookings
)

router.get(
  '/payments',
  passport.authenticate('jwt', { session: false }),
  authorize(['ADMIN']),
  adminController.getPayments
)

export default router

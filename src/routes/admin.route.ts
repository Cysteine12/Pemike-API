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
  '/users/role/:role',
  passport.authenticate('jwt', { session: false }),
  authorize(['ADMIN']),
  adminController.getUsersByRole
)

router.get(
  '/users/search',
  passport.authenticate('jwt', { session: false }),
  authorize(['ADMIN']),
  adminController.searchUsersByName
)

router.get(
  '/users/:id',
  passport.authenticate('jwt', { session: false }),
  authorize(['ADMIN']),
  adminController.getUser
)

router.post(
  '/users',
  passport.authenticate('jwt', { session: false }),
  authorize(['ADMIN']),
  adminController.createUser
)

router.patch(
  '/users/role',
  passport.authenticate('jwt', { session: false }),
  authorize(['ADMIN']),
  adminController.updateUserRole
)

router.get(
  '/seats/trip/:tripId',
  passport.authenticate('jwt', { session: false }),
  authorize(['ADMIN']),
  adminController.getSeatsByTrip
)

router.post(
  '/seats/reserve',
  passport.authenticate('jwt', { session: false }),
  authorize(['ADMIN']),
  adminController.reserveSeat
)

router.get(
  '/payments',
  passport.authenticate('jwt', { session: false }),
  authorize(['ADMIN']),
  adminController.getPayments
)

router.get(
  '/payments/status/:status',
  passport.authenticate('jwt', { session: false }),
  authorize(['ADMIN']),
  adminController.getPaymentsByStatus
)

router.get(
  '/payments/booking/status/:status',
  passport.authenticate('jwt', { session: false }),
  authorize(['ADMIN']),
  adminController.getPaymentsByBookingStatus
)

router.get(
  '/payments/booking/user/:userId',
  passport.authenticate('jwt', { session: false }),
  authorize(['ADMIN']),
  adminController.getPaymentsByBookingUser
)

router.get(
  '/payments/search',
  passport.authenticate('jwt', { session: false }),
  authorize(['ADMIN']),
  adminController.searchPaymentsByReference
)

router.get(
  '/payments/:id',
  passport.authenticate('jwt', { session: false }),
  authorize(['ADMIN']),
  adminController.getPayment
)

export default router

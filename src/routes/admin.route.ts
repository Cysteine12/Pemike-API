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
  '/users/:id',
  passport.authenticate('jwt', { session: false }),
  authorize(['ADMIN']),
  adminController.getUser
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

export default router

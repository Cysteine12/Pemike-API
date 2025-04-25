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
  '/users/:role/role',
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
  adminController.updateRole
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

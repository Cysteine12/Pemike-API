import express from 'express'
import { userController } from '../controllers'
import passport from 'passport'

const router = express.Router()

router.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  userController.getProfile
)

router.patch(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  userController.updateProfile
)

export default router

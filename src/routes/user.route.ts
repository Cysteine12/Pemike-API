import express from 'express'
import { userController } from '../controllers'
import passport from 'passport'
import { validate } from '../middlewares/validate'
import { userValidation } from '../validations'

const router = express.Router()

router.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  userController.getProfile
)

router.patch(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  validate(userValidation.updateProfileSchema),
  userController.updateProfile
)

export default router

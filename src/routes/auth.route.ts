import express from 'express'
import { authController } from '../controllers'
import { authValidation } from '../validations'
import passport from 'passport'
import { validate } from '../middlewares/validate'

const router = express.Router()

router.post(
  '/register',
  validate(authValidation.registerSchema),
  authController.register
)

router.post(
  '/login',
  validate(authValidation.loginSchema),
  authController.login
)

router.post(
  '/verify-email',
  validate(authValidation.verifyEmailSchema),
  authController.verifyEmail
)

router.post(
  '/forgot-password',
  validate(authValidation.forgotPasswordSchema),
  authController.forgotPassword
)

router.post(
  '/reset-password',
  validate(authValidation.resetPasswordSchema),
  authController.resetPassword
)

router.post(
  '/change-password',
  passport.authenticate('jwt', { session: false }),
  validate(authValidation.changePasswordSchema),
  authController.changePassword
)

router.post('/refresh-token', authController.refreshToken)

router.post(
  '/request-otp',
  validate(authValidation.requestOTPSchema),
  authController.requestOTP
)

router.post(
  '/verify-otp',
  validate(authValidation.verifyOTPSchema),
  authController.verifyOTP
)

router.post('/logout', authController.logout)

export default router

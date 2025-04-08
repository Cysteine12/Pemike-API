import express from 'express'
import { authController } from '../controllers'
import passport from 'passport'

const router = express.Router()

router.post('/register', authController.register)

router.post('/login', authController.login)

router.post('/verify-email', authController.verifyEmail)

router.post('/forgot-password', authController.forgotPassword)

router.post('/reset-password', authController.resetPassword)

router.post(
  '/change-password',
  passport.authenticate('jwt', { session: false }),
  authController.changePassword
)

router.post('/refresh-token', authController.refreshToken)

router.post('/request-otp', authController.requestOTP)

router.post('/verify-otp', authController.verifyOTP)

router.post('/logout', authController.logout)

export default router

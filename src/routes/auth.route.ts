import express from 'express'
import { authController } from '../controllers'
import passport from 'passport'

const router = express.Router()

router.post('/register', authController.register)

router.post('/login', authController.login)

router.post('/passwordless-login', authController.passwordlessLogin)

router.post('/verify-email', authController.verifyEmail)

router.post(
  '/set-password',
  passport.authenticate('jwt', { session: false }),
  authController.setPassword
)

router.post(
  '/change-password',
  passport.authenticate('jwt', { session: false }),
  authController.changePassword
)

router.post('/refresh-token', authController.refreshToken)

router.post('/logout', authController.logout)

router.post('/request-otp', authController.requestOTP)

router.post('/verify-otp', authController.verifyOTP)

export default router

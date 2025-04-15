import express from 'express'
import { paymentController } from '../controllers'
import passport from 'passport'
import { authorize, authorizeWebhook } from '../middlewares/authorize'

const router = express.Router()

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  authorize(['CUSTOMER']),
  paymentController.getPayments
)

router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  authorize(['CUSTOMER']),
  paymentController.getPayment
)

router.post(
  '/initialize-payment',
  passport.authenticate('jwt', { session: false }),
  authorize(['CUSTOMER']),
  paymentController.initializePayment
)

router.post(
  '/verify-payment/:reference',
  passport.authenticate('jwt', { session: false }),
  authorize(['CUSTOMER']),
  paymentController.verifyPayment
)

router.post(
  '/payment-webhook',
  authorizeWebhook,
  paymentController.paymentWebhook
)

export default router

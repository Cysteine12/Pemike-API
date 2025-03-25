import { Request } from 'express'
import { emailService, paymentService } from '../services'
import catchAsync from '../utils/catchAsync'
import { PaymentAPIError } from '../middlewares/errorHandler'
import { Payment } from '@prisma/client'

const initializePayment = catchAsync(async (req: Request, res) => {
  const payload = {
    email: req.body.email,
    amount: req.body.amount * 100,
    metadata: {
      bookingId: req.body.bookingId,
    },
  }

  const response: any = await paymentService.initializePayment(payload)

  if (!response) throw new PaymentAPIError('Payment attempt failed')

  res.status(200).json({
    success: true,
    data: response.data.data.authorization_url,
  })
})

const verifyPayment = catchAsync(async (req: Request, res) => {
  const { reference } = req.params

  const response: any = await paymentService.verifyPayment(reference)

  if (response.data.data.status !== 'success') {
    throw new PaymentAPIError(
      `Payment verification ${response.data.data.status}`
    )
  }

  const newPayment = {
    amount: response.data.data.amount / 100,
    reference: response.data.data.reference,
    method: response.data.data.channel,
    status: response.data.data.status,
    bookingId: response.data.data.metadata.bookingId,
  } as Payment

  const savedPayment = await paymentService.createPayment(newPayment)

  await emailService.sendPaymentVerificationMail(
    response.data.data.customer.email,
    savedPayment
  )

  res.status(200).json({
    success: true,
    data: savedPayment,
    message: 'Payment verification successful',
  })
})

export default {
  initializePayment,
  verifyPayment,
}

import { Request } from 'express'
import { emailService, paymentService } from '../services'
import catchAsync from '../utils/catchAsync'
import { NotFoundError, PaymentAPIError } from '../middlewares/errorHandler'
import seatService from '../services/seat.service'
import { Payment, SeatStatus } from '@prisma/client'

const getPayment = catchAsync(async (req, res) => {
  const { id } = req.params

  const payment = await paymentService.findPaymentById(id)

  if (!payment) {
    throw new NotFoundError('Payment not found')
  }

  res.status(200).json({
    success: true,
    data: payment,
  })
})

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
  if (!response || !response.data.data.metadata.bookingId) {
    throw new PaymentAPIError(`Invalid payment reference`)
  }

  const newPayment = {
    amount: response.data.data.amount / 100,
    reference: response.data.data.reference,
    method: response.data.data.channel,
    status: response.data.data.status.toUpperCase(),
    bookingId: response.data.data.metadata.bookingId,
  } as Payment

  if (response.data.data.status !== 'success') {
    const savedPayment = await paymentService.createPayment(newPayment)
    res.status(200).json({
      success: true,
      data: savedPayment,
      message: 'Payment verification failed',
    })
  }

  await seatService.updateManySeats(
    { bookingId: newPayment.bookingId },
    { status: SeatStatus.BOOKED }
  )
  const savedPayment = await paymentService.createPayment(newPayment)

  await emailService.sendPaymentVerificationMail(
    response.data.data.customer.email,
    savedPayment
  )

  res.status(200).json({
    success: true,
    data: savedPayment,
    message: 'Payment verified successfully',
  })
})

export default {
  getPayment,
  initializePayment,
  verifyPayment,
}

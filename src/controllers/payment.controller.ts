import crypto from 'crypto'
import cache from '../config/cache'
import { config } from '../config/config'
import catchAsync from '../utils/catchAsync'
import seatService from '../services/seat.service'
import { PaymentStatus, SeatStatus } from '@prisma/client'
import { emailService, paymentService } from '../services'
import {
  PaymentCreateInput,
  PaymentPayload,
  PaystackWebhookEvent,
} from '../services/payment.service'
import pick from '../utils/pick'
import logger from '../middlewares/logger'
import {
  NotFoundError,
  PaymentAPIError,
  UnauthorizedError,
  ValidationError,
} from '../middlewares/errorHandler'

const getPayments = catchAsync(async (req, res) => {
  const userId = req.user!.id
  const page = parseInt(req.query.page!)
  const limit = parseInt(req.query.limit!)

  const payments = await paymentService.findPayments(
    { booking: { userId } },
    { page, limit }
  )

  res.status(200).json({
    success: true,
    data: payments,
  })
})

const getPayment = catchAsync(async (req, res) => {
  const userId = req.user!.id
  const { id } = req.params

  const payment = await paymentService.findPayment({ id, booking: { userId } })

  if (!payment) {
    throw new NotFoundError('Payment not found')
  }

  res.status(200).json({
    success: true,
    data: payment,
  })
})

const initializePayment = catchAsync(async (req, res) => {
  const newPayment = pick(req.body, ['email', 'amount', 'bookingId'])

  const earliestSelectedSeat = await seatService.findSeat(
    { bookingId: newPayment.bookingId },
    { orderBy: { updatedAt: 'asc' } }
  )
  if (!earliestSelectedSeat) throw new NotFoundError('Booked seat not found')
  console.log(earliestSelectedSeat, cache.has(earliestSelectedSeat.id))

  //add match for sessiontoken
  const expiryInMs = cache.getTtl(earliestSelectedSeat.id)
  if (!expiryInMs) throw new NotFoundError('Seat lock expired')

  const payload: PaymentPayload = {
    email: newPayment.email,
    amount: newPayment.amount * 100,
    metadata: { bookingId: newPayment.bookingId },
    expiry: expiryInMs / 1000,
  }

  const response: any = await paymentService.initializePayment(payload)

  if (!response) throw new PaymentAPIError('Payment attempt failed')

  res.status(200).json({
    success: true,
    data: response.data.data.authorization_url,
  })
})

const verifyPayment = catchAsync(async (req, res) => {
  const { reference } = req.params

  const response: any = await paymentService.verifyPayment(reference)
  if (!response || !response.data?.data?.metadata?.bookingId) {
    throw new PaymentAPIError(`Invalid payment reference`)
  }

  const newPayment: PaymentCreateInput = {
    amount: response.data.data.amount / 100,
    reference: response.data.data.reference,
    method: response.data.data.channel,
    status: response.data.data.status.toUpperCase(),
    booking: { connect: { id: response.data.data.metadata.bookingId } },
  }

  if (response.data.data.status !== 'success') {
    const savedPayment = await paymentService.createPayment(newPayment)

    res.status(200).json({
      success: true,
      data: savedPayment,
      message: 'Payment verification failed',
    })
  }

  await seatService.updateManySeats(
    { bookingId: newPayment.booking.connect?.id },
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

const paymentWebhook = catchAsync(async (req, res) => {
  const event: PaystackWebhookEvent = req.body

  const hash = crypto
    .createHmac('sha512', config.PAYSTACK_SECRET_KEY)
    .update(req.rawBody!)
    .digest('hex')

  if (hash !== req.headers['x-paystack-signature']) {
    throw new UnauthorizedError('Invalid signature')
  }

  if (event.event !== 'charge.success') {
    throw new ValidationError('Event ignored')
  }

  logger.info(event.data)

  const newPayment: PaymentCreateInput = {
    amount: event.data.amount / 100,
    reference: event.data.reference,
    method: event.data.channel,
    status: event.data.status.toUpperCase() as PaymentStatus,
    booking: { connect: { id: event.data.metadata.bookingId } },
  }

  await seatService.updateManySeats(
    { bookingId: newPayment.booking.connect?.id },
    { status: SeatStatus.BOOKED }
  )
  const savedPayment = await paymentService.createPayment(newPayment)

  await emailService.sendPaymentVerificationMail(
    event.data.customer.email,
    savedPayment
  )

  res.status(200).send('Payment received')
})

export default {
  getPayments,
  getPayment,
  initializePayment,
  verifyPayment,
  paymentWebhook,
}

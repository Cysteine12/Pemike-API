import cache from '../config/cache'
import catchAsync from '../utils/catchAsync'
import seatService from '../services/seat.service'
import { PaymentStatus, Seat, SeatStatus } from '@prisma/client'
import { emailService, fareConditionService, paymentService } from '../services'
import {
  PaymentPayload,
  PaymentUncheckedCreateInput,
  PaymentUncheckedUpdateInput,
  PaymentWhereUniqueInput,
  PaystackWebhookEvent,
} from '../services/payment.service'
import pick from '../utils/pick'
import {
  CacheAPIError,
  NotFoundError,
  PaymentAPIError,
} from '../middlewares/errorHandler'
import { Request, Response } from 'express'
import { Cache } from '../types/Cache'
import { getTotalFare } from '../utils/getTotalFare'

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
  if (!payment) throw new NotFoundError('Payment not found')

  res.status(200).json({
    success: true,
    data: payment,
  })
})

const initializePayment = catchAsync(async (req, res) => {
  const user = req.user!
  const data = pick(req.body, ['sessionID', 'tripId', 'bookingId'])

  const seats = (await seatService.findSeats({
    bookingId: data.bookingId,
  })) as Seat[]

  seats.forEach((seat: Seat) => {
    const cachedObj = cache.get(seat.id) as Cache
    if (!cachedObj || cachedObj.sessionID !== data.sessionID) {
      throw new CacheAPIError('Seat lock expired')
    }
  })

  const fareCondition =
    await fareConditionService.findMatchingFareConditionForTrip(data.tripId)
  if (!fareCondition) throw new NotFoundError('Fare not found')

  const totalFare = getTotalFare(seats, fareCondition)

  const payload: PaymentPayload = {
    email: user.email,
    amount: totalFare * 100,
    metadata: { bookingId: data.bookingId },
  }

  const response: any = await paymentService.initializePayment(payload)
  if (!response) throw new PaymentAPIError('Payment attempt failed')

  const newPayment: PaymentUncheckedCreateInput = {
    amount: totalFare,
    reference: response.data.data.reference,
    status: PaymentStatus.PENDING,
    bookingId: data.bookingId,
  }
  await paymentService.createPayment(newPayment)

  res.status(200).json({
    success: true,
    data: response.data.data.authorization_url,
  })
})

const verifyPayment = catchAsync(async (req, res) => {
  const { reference } = req.params

  const response: any = await paymentService.verifyPayment(reference)

  const bookingId = response.data?.data?.metadata?.bookingId
  if (!bookingId) throw new PaymentAPIError(`Invalid payment reference`)

  const payment = await paymentService.findPayment({
    reference_bookingId: { reference, bookingId },
  })

  if (!payment) throw new NotFoundError('Payment not found')

  res.status(200).json({
    success: true,
    data: payment,
    message: 'Payment verified successfully',
  })
})

const paymentWebhook = async (req: Request, res: Response) => {
  try {
    const event: PaystackWebhookEvent = req.body

    const newPayment: PaymentUncheckedUpdateInput = {
      amount: event.data.amount / 100,
      reference: event.data.reference,
      method: event.data.channel,
      status: event.data.status.toUpperCase() as PaymentStatus,
      bookingId: event.data.metadata.bookingId,
    }
    const filter: PaymentWhereUniqueInput = {
      reference_bookingId: {
        reference: event.data.reference,
        bookingId: event.data.metadata.bookingId,
      },
    }

    if (event.event !== 'charge.success') {
      await paymentService.updatePayment(filter, newPayment)

      res.status(200).send('Payment received')
    }

    const savedPayment = await paymentService.updatePayment(filter, newPayment)

    await seatService.updateManySeats(
      { bookingId: event.data.bookingId },
      { status: SeatStatus.BOOKED }
    )

    await emailService.sendPaymentVerificationMail(
      event.data.customer.email,
      savedPayment
    )

    res.status(200).send('Payment received')
  } catch (err) {
    console.error(err)
    res.status(400).send('Event ignored')
  }
}

export default {
  getPayments,
  getPayment,
  initializePayment,
  verifyPayment,
  paymentWebhook,
}

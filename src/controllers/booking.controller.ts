import { Seat } from '@prisma/client'
import { bookingService, seatService } from '../services'
import catchAsync from '../utils/catchAsync'
import cache from '../config/cache'
import { CacheAPIError, NotFoundError } from '../middlewares/errorHandler'
import { Cache } from '../types/Cache'

const getBookings = catchAsync(async (req, res) => {
  const userId = req.user!.id
  const page = parseInt(req.query.page!)
  const limit = parseInt(req.query.limit!)

  const bookings = await bookingService.findBookings(
    { userId },
    { page, limit }
  )

  res.status(200).json({
    success: true,
    data: bookings,
  })
})

const getBooking = catchAsync(async (req, res) => {
  const userId = req.user!.id
  const { id } = req.params

  const booking = await bookingService.findBooking({ id, userId })
  if (!booking) throw new NotFoundError('Booking not found')

  res.status(200).json({
    success: true,
    data: booking,
  })
})

const createBooking = catchAsync(async (req, res) => {
  const { id } = req.user!
  const { seats, sessionToken, tripId } = req.body

  const newBooking = { userId: id, tripId: tripId }

  seats.forEach((seat: Seat) => {
    const cachedObj = cache.get(seat.id) as Cache
    if (!cachedObj || cachedObj.sessionToken !== sessionToken) {
      throw new CacheAPIError('Seat lock expired')
    }
  })

  const savedBooking = await bookingService.updateOrCreateBooking(
    { userId_tripId: newBooking },
    newBooking
  )
  delete (savedBooking.user as any).password

  await seatService.updateManySeats(
    { bookingId: savedBooking.id },
    { bookingId: null }
  )

  const filter = { id: { in: seats.map((seat: Seat) => seat.id) } }
  await seatService.updateManySeats(filter, { bookingId: savedBooking.id })

  res.status(201).json({
    success: true,
    data: savedBooking,
  })
})

export default {
  getBookings,
  getBooking,
  createBooking,
}

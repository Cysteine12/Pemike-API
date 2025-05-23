import { BookingStatus, Seat, SeatStatus } from '@prisma/client'
import { bookingService, fareConditionService, seatService } from '../services'
import catchAsync from '../utils/catchAsync'
import cache from '../config/cache'
import { CacheAPIError, NotFoundError } from '../middlewares/errorHandler'
import { Cache } from '../types/Cache'
import { BookingUncheckedCreateInput } from '../services/booking.service'
import { CreateBookingSchema } from '../validations/booking.validation'

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
  let { sessionID, tripId, seats }: CreateBookingSchema = req.body
  seats = seats.map((seat) => ({
    id: seat.id,
    passengerType: seat.passengerType,
  }))

  seats.forEach((seat) => {
    const cachedObj = cache.get(seat.id) as Cache
    if (!cachedObj || cachedObj.sessionID !== sessionID) {
      throw new CacheAPIError('Seat lock expired')
    }
  })

  const fareCondition =
    await fareConditionService.findMatchingFareConditionForTrip(tripId)
  if (!fareCondition) throw new NotFoundError('Fare not found')

  const newBooking: BookingUncheckedCreateInput = {
    userId: id,
    tripId: tripId,
    fareConditionId: fareCondition.id,
  }

  const savedBooking = await bookingService.updateOrCreateBooking(
    { userId_tripId: { userId: id, tripId } },
    newBooking
  )
  delete (savedBooking.user as any).password

  await seatService.updateManySeats(
    { bookingId: savedBooking.id },
    { bookingId: null }
  )

  await seatService.updateManySeatsTransaction(tripId, seats, savedBooking.id)

  res.status(201).json({
    success: true,
    data: savedBooking,
  })
})

const cancelBooking = catchAsync(async (req, res) => {
  const userId = req.user?.id
  const id = req.params.id

  const updatedBooking = await bookingService.updateBooking(
    { id, userId, trip: { departureSchedule: { gt: new Date() } } },
    { status: BookingStatus.CANCELED }
  )
  if (!updatedBooking) throw new NotFoundError('Booking not found')

  await seatService.updateManySeats(
    { bookingId: updatedBooking.id },
    { bookingId: null, status: SeatStatus.AVAILABLE }
  )

  res.status(201).json({
    success: true,
    message: 'Booking cancelled successfully',
  })
})

export default {
  getBookings,
  getBooking,
  createBooking,
  cancelBooking,
}

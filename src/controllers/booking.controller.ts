import { Seat } from '@prisma/client'
import { bookingService } from '../services'
import catchAsync from '../utils/catchAsync'
import cache from '../config/cache'
import { CacheAPIError } from '../middlewares/errorHandler'
import { Cache } from '../types/Cache'

const createBooking = catchAsync(async (req, res) => {
  const { seats, sessionToken } = req.body
  const newBooking = { userId: req.user.id, tripId: req.body.tripId }

  seats.forEach((seat: Seat) => {
    const cachedObj = cache.get(seat.id) as Cache
    if (!cachedObj || cachedObj.sessionToken !== sessionToken) {
      throw new CacheAPIError('Seat lock expired')
    }
  })

  const savedBooking = await bookingService.createBooking(newBooking)

  delete (savedBooking?.user as any).password

  res.status(201).json({
    success: true,
    data: savedBooking,
  })
})

export default {
  createBooking,
}

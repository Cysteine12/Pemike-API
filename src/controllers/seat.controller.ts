import { seatService } from '../services'
import catchAsync from '../utils/catchAsync'
import { CacheAPIError, UnauthorizedError } from '../middlewares/errorHandler'
import cache from '../config/cache'
import { v4 as uuidv4 } from 'uuid'

const getSeatsByTrip = catchAsync(async (req, res) => {
  const filter = { tripId: req.params.id }
  const options = { select: ['id', 'seatNo', 'status'] }

  const seats = await seatService.getSeatsByTrip(filter, options)

  const filteredSeat = seats.map((seat: any) => {
    if (seat.status !== 'booked' && cache.has(seat.id)) seat.status = 'reserved'
    return seat
  })

  res.status(200).json({
    success: true,
    data: filteredSeat,
  })
})

const reserveSeat = catchAsync(async (req, res) => {
  let { tripId, seatNo, sessionToken } = req.body
  if (!sessionToken) sessionToken = uuidv4()

  let seat = await seatService.reserveSeat(
    { tripId, seatNo },
    { tripId, seatNo, sessionToken }
  )
  if (!seat) throw new UnauthorizedError('Unable to reserve seat')
  seat.status = 'reserved'

  const isCached = cache.has(seat.id)
  if (isCached) throw new CacheAPIError('Seat already reserved')

  const cachedObj = cache.set(seat.id, { seatNo, sessionToken }, 15 * 60)
  if (!cachedObj) throw new CacheAPIError('An Error Ocurred')

  res.status(201).json({
    success: true,
    data: seat,
  })
})

export default {
  getSeatsByTrip,
  reserveSeat,
}

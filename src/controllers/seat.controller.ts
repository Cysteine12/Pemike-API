import { seatService } from '../services'
import catchAsync from '../utils/catchAsync'
import { CacheAPIError, UnauthorizedError } from '../middlewares/errorHandler'
import cache from '../config/cache'
import { v4 as uuidv4 } from 'uuid'
import { Seat, SeatStatus } from '@prisma/client'

const getSeatsByTrip = catchAsync(async (req, res) => {
  const filter = { tripId: req.params.id }
  const options = { select: ['id', 'seatNo', 'status'] }

  const seats = (await seatService.findSeatsByTrip(filter, options)) as Seat[]

  const filteredSeat = seats.map((seat: Seat) => {
    if (seat.status !== SeatStatus.BOOKED && cache.has(seat.id))
      seat.status = SeatStatus.RESERVED
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

  let seat = await seatService.createSeat(
    { tripId, seatNo },
    { tripId, seatNo, sessionToken }
  )
  if (!seat) throw new UnauthorizedError('Unable to reserve seat')
  seat.status = SeatStatus.RESERVED

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

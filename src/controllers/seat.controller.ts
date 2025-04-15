import { seatService } from '../services'
import catchAsync from '../utils/catchAsync'
import { CacheAPIError, UnauthorizedError } from '../middlewares/errorHandler'
import cache from '../config/cache'
import { v4 as uuidv4 } from 'uuid'
import { Seat, SeatStatus } from '@prisma/client'
import select from '../utils/select'
import { SeatFindManyArgs, SeatWhereInput } from '../services/seat.service'

const getSeatsByTrip = catchAsync(async (req, res) => {
  const filter: SeatWhereInput = { tripId: req.params.id }
  const options: SeatFindManyArgs = {
    select: select(['id', 'seatNo', 'status']),
  }

  const seats = await seatService.findSeats(filter, options)

  const filteredSeats = seats.map((seat) => {
    if (seat.status !== SeatStatus.BOOKED && cache.has(seat.id!))
      seat.status = SeatStatus.RESERVED
    return seat
  })

  res.status(200).json({
    success: true,
    data: filteredSeats,
  })
})

const reserveSeat = catchAsync(async (req, res) => {
  let { tripId, seatNo, sessionID } = req.body
  if (!sessionID) sessionID = uuidv4()

  let seat = await seatService.updateOrCreateSeat(
    { seatNo_tripId: { seatNo, tripId } },
    { tripId, seatNo }
  )
  if (!seat) throw new UnauthorizedError('Unable to reserve seat')
  seat.status = SeatStatus.RESERVED

  const isCached = cache.has(seat.id)
  if (isCached) throw new CacheAPIError('Seat already reserved')

  const cachedObj = cache.set(seat.id, { seatNo, sessionID }, 15 * 60)
  if (!cachedObj) throw new CacheAPIError('An Error Ocurred')

  res.status(201).json({
    success: true,
    data: { ...seat, sessionID },
  })
})

export default {
  getSeatsByTrip,
  reserveSeat,
}

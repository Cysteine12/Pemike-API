var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
import { seatService } from '../services'
import catchAsync from '../utils/catchAsync'
import { CacheAPIError, UnauthorizedError } from '../middlewares/errorHandler'
import cache from '../config/cache'
import { v4 as uuidv4 } from 'uuid'
import { SeatStatus } from '@prisma/client'
const getSeatsByTrip = catchAsync((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const filter = { tripId: req.params.id }
    const options = { select: ['id', 'seatNo', 'status'] }
    const seats = yield seatService.findSeatsByTrip(filter, options)
    const filteredSeat = seats.map((seat) => {
      if (seat.status !== SeatStatus.BOOKED && cache.has(seat.id))
        seat.status = SeatStatus.RESERVED
      return seat
    })
    res.status(200).json({
      success: true,
      data: filteredSeat,
    })
  })
)
const reserveSeat = catchAsync((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    let { tripId, seatNo, sessionID } = req.body
    if (!sessionID) sessionID = uuidv4()
    let seat = yield seatService.createSeat(
      { tripId, seatNo },
      { tripId, seatNo, sessionID }
    )
    if (!seat) throw new UnauthorizedError('Unable to reserve seat')
    seat.status = SeatStatus.RESERVED
    const isCached = cache.has(seat.id)
    if (isCached) throw new CacheAPIError('Seat already reserved')
    const cachedObj = cache.set(seat.id, { seatNo, sessionID }, 15 * 60)
    if (!cachedObj) throw new CacheAPIError('An Error Ocurred')
    res.status(201).json({
      success: true,
      data: seat,
    })
  })
)
export default {
  getSeatsByTrip,
  reserveSeat,
}

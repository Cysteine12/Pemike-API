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
import { bookingService } from '../services'
import catchAsync from '../utils/catchAsync'
import cache from '../config/cache'
import { CacheAPIError } from '../middlewares/errorHandler'
const createBooking = catchAsync((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { seats, sessionID } = req.body
    const newBooking = { userId: req.user.id, tripId: req.body.tripId }
    seats.forEach((seat) => {
      const cachedObj = cache.get(seat.id)
      if (!cachedObj || cachedObj.sessionID !== sessionID) {
        throw new CacheAPIError('Seat lock expired')
      }
    })
    const savedBooking = yield bookingService.createBooking(newBooking)
    delete (
      savedBooking === null || savedBooking === void 0
        ? void 0
        : savedBooking.user
    ).password
    res.status(201).json({
      success: true,
      data: savedBooking,
    })
  })
)
export default {
  createBooking,
}

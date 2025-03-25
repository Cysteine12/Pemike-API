import { tripService } from '../services'
import { NotFoundError } from '../middlewares/errorHandler'
import catchAsync from '../utils/catchAsync'

const getTrips = catchAsync(async (req, res) => {
  const { page, limit } = req.query
  const options = { page: Number(page), limit: Number(limit) }

  const trips = await tripService.getTrips({}, options)

  res.status(200).json({
    success: true,
    data: trips,
  })
})

const searchTripsByParams = catchAsync(async (req, res) => {
  const { destination, source } = req.query
  const filter = { source, destination }

  const trips = await tripService.getTrips(filter, {})

  res.status(200).json({
    success: true,
    data: trips,
  })
})

const getTrip = catchAsync(async (req, res) => {
  const { id } = req.params

  const trip = await tripService.getTripById(id)

  if (!trip) {
    throw new NotFoundError('Trip not found')
  }

  res.status(200).json({
    success: true,
    data: trip,
  })
})

export default {
  getTrips,
  searchTripsByParams,
  getTrip,
}

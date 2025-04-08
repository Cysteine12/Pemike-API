import { tripService } from '../services'
import { NotFoundError } from '../middlewares/errorHandler'
import catchAsync from '../utils/catchAsync'
import pick from '../utils/pick'
import { TripWhereInput } from '../services/trip.service'

const getTrips = catchAsync(async (req, res) => {
  const query = pick(req.query, ['page', 'limit'])
  const options = { page: Number(query.page), limit: Number(query.limit) }

  const trips = await tripService.findTrips({}, options)

  res.status(200).json({
    success: true,
    data: trips,
  })
})

const searchTripsByParams = catchAsync(async (req, res) => {
  const query = pick(req.query, ['page', 'limit', 'source', 'destination'])

  const options = { page: Number(query.page), limit: Number(query.limit) }
  const filter: TripWhereInput = {
    OR: [{ source: query.source }, { destination: query.destination }],
  }

  const trips = await tripService.findTrips(filter, options)

  res.status(200).json({
    success: true,
    data: trips,
  })
})

const getTrip = catchAsync(async (req, res) => {
  const { id } = req.params

  const trip = await tripService.findTrip({ id })
  if (!trip) throw new NotFoundError('Trip not found')

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

import { tripService } from '../services'
import { NotFoundError } from '../middlewares/errorHandler'
import catchAsync from '../utils/catchAsync'
import pick from '../utils/pick'
import {
  TripUncheckedCreateInput,
  TripUncheckedUpdateInput,
  TripWhereInput,
} from '../services/trip.service'
import { FareConditionCreateWithoutTripInput } from '../services/fare_condition.service'

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

const createTrip = catchAsync(async (req, res) => {
  const newTrip = pick<TripUncheckedCreateInput>(req.body, [
    'source',
    'destination',
    'departureSchedule',
    'firstChangePercent',
    'secondChangePercent',
    'refundDays',
    'driverId',
    'vehicleId',
  ]) as TripUncheckedCreateInput

  const newFareConditions = req.body.fareConditions.map(
    (fareCondition: FareConditionCreateWithoutTripInput) => {
      return pick<FareConditionCreateWithoutTripInput>(fareCondition, [
        'conditionLabel',
        'adultPrice',
        'childPrice',
        'infantPrice',
        'maxWeeksBefore',
        'minWeeksBefore',
        'cancelLessThan48h',
      ])
    }
  ) as FareConditionCreateWithoutTripInput[]

  const savedTrip = await tripService.createTrip({
    ...newTrip,
    FareCondition: { createMany: { data: newFareConditions } },
  })

  res.status(201).json({
    success: true,
    data: savedTrip,
    message: 'Trip created successfully',
  })
})

const updateTrip = catchAsync(async (req, res) => {
  const id = req.params.id

  const newTrip = pick<TripUncheckedUpdateInput>(req.body, [
    'source',
    'destination',
    'departureSchedule',
    'firstChangePercent',
    'secondChangePercent',
    'refundDays',
    'driverId',
    'vehicleId',
  ]) as TripUncheckedUpdateInput

  await tripService.updateTrip({ id }, newTrip)

  res.status(201).json({
    success: true,
    message: 'Trip updated successfully',
  })
})

const deleteTrip = catchAsync(async (req, res) => {
  const id = req.params.id

  const deletedTrip = await tripService.deleteTrip({ id })
  if (!deletedTrip) throw new NotFoundError('Trip not found')

  res.status(200).json({
    success: true,
    message: 'Trip deleted successfully',
  })
})

export default {
  getTrips,
  searchTripsByParams,
  getTrip,
  createTrip,
  updateTrip,
  deleteTrip,
}

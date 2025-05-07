import { tripService } from '../services'
import { NotFoundError } from '../middlewares/errorHandler'
import catchAsync from '../utils/catchAsync'
import pick from '../utils/pick'
import { TripWhereInput } from '../services/trip.service'
import {
  CreateTripSchema,
  UpdateTripSchema,
} from '../validations/trip.validation'

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
  const payload: CreateTripSchema = req.body
  const newTrip = pick(payload, [
    'source',
    'destination',
    'departureSchedule',
    'firstChangePercent',
    'secondChangePercent',
    'refundDays',
    'driverId',
    'vehicleId',
  ])

  const newFareConditions = payload.fareConditions.map((fareCondition) => {
    return pick(fareCondition, [
      'conditionLabel',
      'adultPrice',
      'childPrice',
      'infantPrice',
      'maxWeeksBefore',
      'minWeeksBefore',
      'cancelLessThan48h',
    ])
  })

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
  const payload: UpdateTripSchema = req.body

  const newTrip = pick(payload, [
    'source',
    'destination',
    'departureSchedule',
    'firstChangePercent',
    'secondChangePercent',
    'refundDays',
    'driverId',
    'vehicleId',
  ])

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

import { NotFoundError } from '../middlewares/errorHandler'
import { vehicleService } from '../services'
import {
  VehicleUncheckedCreateInput,
  VehicleUncheckedUpdateInput,
  VehicleWhereInput,
} from '../services/vehicle.service'
import catchAsync from '../utils/catchAsync'
import pick from '../utils/pick'

const getVehicles = catchAsync(async (req, res) => {
  const query = pick(req.query, ['page', 'limit'])
  const options = { page: Number(query.page), limit: Number(query.limit) }

  const vehicles = await vehicleService.findVehicles({}, options)

  res.status(200).json({
    success: true,
    data: vehicles,
  })
})

const fetchVehiclesByStatus = catchAsync(async (req, res) => {
  const { status } = req.params
  const query = pick(req.query, ['page', 'limit'])

  const filter: VehicleWhereInput = { available: status === 'available' }
  const options = { page: Number(query.page), limit: Number(query.limit) }

  const vehicles = await vehicleService.findVehicles(filter, options)

  res.status(200).json({
    success: true,
    data: vehicles,
  })
})

const searchVehiclesByLicense = catchAsync(async (req, res) => {
  const query = pick(req.query, ['page', 'limit', 'search'])

  const filter: VehicleWhereInput = { licenseNo: { contains: query.search } }
  const options = { page: Number(query.page), limit: Number(query.limit) }

  const vehicles = await vehicleService.findVehicles(filter, options)

  res.status(200).json({
    success: true,
    data: vehicles,
  })
})

const getVehicle = catchAsync(async (req, res) => {
  const { id } = req.params

  const vehicle = await vehicleService.findVehicle({ id })
  if (!vehicle) throw new NotFoundError('Vehicle not found')

  res.status(200).json({
    success: true,
    data: vehicle,
  })
})

const createVehicle = catchAsync(async (req, res) => {
  const newVehicle = pick<VehicleUncheckedCreateInput>(req.body, [
    'category',
    'brand',
    'model',
    'licenseNo',
    'thumbnail',
    'totalPassengerSeat',
    'available',
  ]) as VehicleUncheckedCreateInput

  const savedVehicle = await vehicleService.createVehicle(newVehicle)

  res.status(201).json({
    success: true,
    data: savedVehicle,
    message: 'Vehicle created successfully',
  })
})

const updateVehicle = catchAsync(async (req, res) => {
  const id = req.params.id

  const newVehicle = pick<VehicleUncheckedUpdateInput>(req.body, [
    'category',
    'brand',
    'model',
    'licenseNo',
    'thumbnail',
    'totalPassengerSeat',
    'available',
  ]) as VehicleUncheckedUpdateInput

  await vehicleService.updateVehicle({ id }, newVehicle)

  res.status(201).json({
    success: true,
    message: 'Vehicle updated successfully',
  })
})

const deleteVehicle = catchAsync(async (req, res) => {
  const id = req.params.id

  const deletedVehicle = await vehicleService.deleteVehicle({ id })
  if (!deletedVehicle) throw new NotFoundError('Trip not found')

  res.status(200).json({
    success: true,
    message: 'Vehicle deleted successfully',
  })
})

export default {
  getVehicles,
  fetchVehiclesByStatus,
  searchVehiclesByLicense,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
}

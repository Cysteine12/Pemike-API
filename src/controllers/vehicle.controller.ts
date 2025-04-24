import { NotFoundError } from '../middlewares/errorHandler'
import { vehicleService } from '../services'
import { VehicleWhereInput } from '../services/vehicle.service'
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

const searchVehiclesByLicense = catchAsync(async (req, res) => {
  const query = pick(req.query, ['page', 'limit', 'licenseNo'])

  const options = { page: Number(query.page), limit: Number(query.limit) }
  const filter: VehicleWhereInput = { licenseNo: query.licenseNo }

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

export default {
  getVehicles,
  searchVehiclesByLicense,
  getVehicle,
}

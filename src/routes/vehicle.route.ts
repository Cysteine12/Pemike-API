import express from 'express'
import { vehicleController } from '../controllers'

const router = express.Router()

router.get('/', vehicleController.getVehicles)

router.get('/search', vehicleController.searchVehiclesByLicense)

router.get('/:id', vehicleController.getVehicle)

export default router

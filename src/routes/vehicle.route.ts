import express from 'express'
import { vehicleController } from '../controllers'
import passport from 'passport'
import { authorize } from '../middlewares/authorize'

const router = express.Router()

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  authorize(['ADMIN']),
  vehicleController.getVehicles
)

router.get(
  '/search',
  passport.authenticate('jwt', { session: false }),
  authorize(['ADMIN']),
  vehicleController.searchVehiclesByLicense
)

router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  authorize(['ADMIN']),
  vehicleController.getVehicle
)

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  authorize(['ADMIN']),
  vehicleController.createVehicle
)

router.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  authorize(['ADMIN']),
  vehicleController.updateVehicle
)

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  authorize(['ADMIN']),
  vehicleController.deleteVehicle
)

export default router

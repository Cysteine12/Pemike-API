import express from 'express'
import { vehicleController } from '../controllers'
import passport from 'passport'
import { authorize } from '../middlewares/authorize'
import { validate } from '../middlewares/validate'
import { vehicleValidation } from '../validations'

const router = express.Router()

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  authorize(['ADMIN']),
  vehicleController.getVehicles
)

router.get(
  '/status/:status',
  passport.authenticate('jwt', { session: false }),
  authorize(['ADMIN']),
  vehicleController.fetchVehiclesByStatus
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
  validate(vehicleValidation.createVehicleSchema),
  vehicleController.createVehicle
)

router.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  authorize(['ADMIN']),
  validate(vehicleValidation.updateVehicleSchema),
  vehicleController.updateVehicle
)

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  authorize(['ADMIN']),
  vehicleController.deleteVehicle
)

export default router

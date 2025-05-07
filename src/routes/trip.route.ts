import express from 'express'
import { tripController } from '../controllers'
import passport from 'passport'
import { authorize } from '../middlewares/authorize'
import { tripValidation } from '../validations'
import { validate } from '../middlewares/validate'

const router = express.Router()

router.get('/', tripController.getTrips)

router.get('/search', tripController.searchTripsByParams)

router.get('/:id', tripController.getTrip)

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  authorize(['ADMIN']),
  validate(tripValidation.createTripSchema),
  tripController.createTrip
)

router.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  authorize(['ADMIN']),
  validate(tripValidation.updateTripSchema),
  tripController.updateTrip
)

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  authorize(['ADMIN']),
  tripController.deleteTrip
)

export default router

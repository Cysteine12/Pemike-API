import express from 'express'
import { tripController } from '../controllers'
import passport from 'passport'
import { authorize } from '../middlewares/authorize'

const router = express.Router()

router.get('/', tripController.getTrips)

router.get('/search', tripController.searchTripsByParams)

router.get('/:id', tripController.getTrip)

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  authorize(['ADMIN']),
  tripController.createTrip
)

router.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  authorize(['ADMIN']),
  tripController.updateTrip
)

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  authorize(['ADMIN']),
  tripController.deleteTrip
)

export default router

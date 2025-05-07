import express from 'express'
import { seatController } from '../controllers'
import { validate } from '../middlewares/validate'
import { seatValidation } from '../validations'

const router = express.Router()

router.get('/trip/:id', seatController.getSeatsByTrip)

router.post(
  '/reserve',
  validate(seatValidation.reserveSeatSchema),
  seatController.reserveSeat
)

export default router

import { Router } from 'express'
import authRoute from './auth.route'
import userRoute from './user.route'
import tripRoute from './trip.route'
import seatRoute from './seat.route'
import bookingRoute from './booking.route'
import paymentRoute from './payment.route'

const router = Router()

const routes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/trips',
    route: tripRoute,
  },
  {
    path: '/seats',
    route: seatRoute,
  },
  {
    path: '/bookings',
    route: bookingRoute,
  },
  {
    path: '/payments',
    route: paymentRoute,
  },
]

routes.forEach((route) => {
  router.use(route.path, route.route)
})

export default router

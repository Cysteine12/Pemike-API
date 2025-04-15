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
    // admin can view users, update a user role
    path: '/users',
    route: userRoute,
  },
  {
    // admin can view, create, update & delete trip
    path: '/trips',
    route: tripRoute,
  },
  {
    // admin can view, reserve a seat
    path: '/seats',
    route: seatRoute,
  },
  {
    path: '/bookings',
    route: bookingRoute,
  },
  {
    // admin can view payments
    path: '/payments',
    route: paymentRoute,
  },
]

routes.forEach((route) => {
  router.use(route.path, route.route)
})

export default router

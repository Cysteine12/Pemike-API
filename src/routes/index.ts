import { Router } from 'express'
import tripRoute from './trip.route'
import seatRoute from './seat.route'

const router = Router()

const routes = [
  {
    path: '/trips',
    route: tripRoute,
  },
  {
    path: '/seats',
    route: seatRoute,
  },
]

routes.forEach((route) => {
  router.use(route.path, route.route)
})

export default router

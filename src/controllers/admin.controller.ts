import { Seat, SeatStatus } from '@prisma/client'
import { NotFoundError } from '../middlewares/errorHandler'
import {
  bookingService,
  paymentService,
  seatService,
  userService,
} from '../services'
import catchAsync from '../utils/catchAsync'
import exclude from '../utils/exclude'
import { SeatUncheckedCreateInput } from '../services/seat.service'

const getUsers = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page!)
  const limit = parseInt(req.query.limit!)

  const users = await userService.findUsers(
    { NOT: { role: 'ADMIN' } },
    { page, limit }
  )

  res.status(200).json({
    success: true,
    data: users,
  })
})

const getUsersByRole = catchAsync(async (req, res) => {
  const role = req.params.role.toUpperCase()
  const page = parseInt(req.query.page!)
  const limit = parseInt(req.query.limit!)

  const users = await userService.findUsers({ role }, { page, limit })

  res.status(200).json({
    success: true,
    data: users,
  })
})

const getUser = catchAsync(async (req, res) => {
  const id = req.params.id

  const user = await userService.findUser({ id })
  if (!user) throw new NotFoundError('User not found')

  const filteredUser = exclude(user, ['password'])

  res.status(200).json({
    success: true,
    user: filteredUser,
  })
})

const updateRole = catchAsync(async (req, res) => {
  const { userId, role } = req.body

  const updatedUser = await userService.updateUser({ id: userId }, { role })

  res.status(200).json({
    success: true,
    user: updatedUser,
    message: 'User role updated successfully',
  })
})

const getSeats = catchAsync(async (req, res) => {
  const tripId = req.params.tripId

  const seats = await seatService.findSeats(
    { tripId, status: { not: SeatStatus.AVAILABLE } },
    {
      include: { booking: { include: { user: { omit: { password: true } } } } },
    }
  )

  res.status(200).json({
    success: true,
    data: seats,
  })
})

const reserveSeats = catchAsync(async (req, res) => {
  const { tripId } = req.body
  const seats = req.body.seats.map(
    (seat: Seat) =>
      ({
        seatNo: seat.seatNo,
        tripId: seat.tripId,
        status: SeatStatus.RESERVED,
      } as SeatUncheckedCreateInput)
  )

  await seatService.updateorCreateManySeatsTransaction(tripId, seats)

  res.status(200).json({
    success: true,
    message: 'Seat(s) reserved successfully',
  })
})

const getBookings = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page!)
  const limit = parseInt(req.query.limit!)

  const bookings = await bookingService.findBookings({}, { page, limit })

  res.status(200).json({
    success: true,
    data: bookings,
  })
})

const getPayments = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page!)
  const limit = parseInt(req.query.limit!)

  const payments = await paymentService.findPayments({}, { page, limit })

  res.status(200).json({
    success: true,
    data: payments,
  })
})

export default {
  getUsers,
  getUsersByRole,
  getUser,
  updateRole,
  getSeats,
  reserveSeats,
  getBookings,
  getPayments,
}

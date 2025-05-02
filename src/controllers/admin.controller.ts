import { SeatStatus, UserRole } from '@prisma/client'
import { NotFoundError } from '../middlewares/errorHandler'
import { paymentService, seatService, userService } from '../services'
import catchAsync from '../utils/catchAsync'
import exclude from '../utils/exclude'
import {
  SeatUncheckedCreateInput,
  SeatWhereUniqueInput,
} from '../services/seat.service'
import cache from '../config/cache'

const getUsers = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page!)
  const limit = parseInt(req.query.limit!)

  const users = await userService.findUsers(
    { NOT: { role: UserRole.ADMIN } },
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

const searchUsersByName = catchAsync(async (req, res) => {
  const { search } = req.query
  const page = parseInt(req.query.page!)
  const limit = parseInt(req.query.limit!)

  const users = await userService.findUsers(
    {
      OR: [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
      ],
    },
    { page, limit }
  )

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
    data: filteredUser,
  })
})

const updateUserRole = catchAsync(async (req, res) => {
  const { userId, role } = req.body

  const updatedUser = await userService.updateUser({ id: userId }, { role })

  res.status(200).json({
    success: true,
    data: updatedUser,
    message: 'User role updated successfully',
  })
})

const getSeatsByTrip = catchAsync(async (req, res) => {
  const tripId = req.params.tripId

  const seats = await seatService.findSeats(
    { tripId },
    {
      include: { booking: { include: { user: { omit: { password: true } } } } },
    }
  )

  const filteredSeats = seats.map((seat) => {
    if (seat.status !== SeatStatus.BOOKED && cache.has(seat.id!))
      seat.status = SeatStatus.RESERVED
    return seat
  })

  res.status(200).json({
    success: true,
    data: filteredSeats,
  })
})

const reserveSeat = catchAsync(async (req, res) => {
  const newSeat = {
    tripId: req.body.tripId,
    seatNo: req.body.seatNo,
    status: req.body.status,
  } as SeatUncheckedCreateInput

  const filter: SeatWhereUniqueInput = {
    seatNo_tripId: { seatNo: newSeat.seatNo, tripId: newSeat.tripId },
  }
  const savedSeat = await seatService.updateOrCreateSeat(filter, newSeat)

  res.status(200).json({
    success: true,
    data: savedSeat,
    message: 'Seat reserved successfully',
  })
})

const getPayments = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page!)
  const limit = parseInt(req.query.limit!)

  const payments = await paymentService.findPayments(
    {},
    { page, limit, include: { booking: { include: { user: true } } } }
  )

  res.status(200).json({
    success: true,
    data: payments,
  })
})

const getPaymentsByStatus = catchAsync(async (req, res) => {
  const status = req.params.status.toUpperCase()
  const page = parseInt(req.query.page!)
  const limit = parseInt(req.query.limit!)

  const payments = await paymentService.findPayments(
    { status },
    {
      page,
      limit,
      include: { booking: { include: { trip: true, user: true } } },
    }
  )

  res.status(200).json({
    success: true,
    data: payments,
  })
})

const getPaymentsByBookingStatus = catchAsync(async (req, res) => {
  const status = req.params.status.toUpperCase()
  const page = parseInt(req.query.page!)
  const limit = parseInt(req.query.limit!)

  const payments = await paymentService.findPayments(
    { booking: { status } },
    {
      page,
      limit,
      include: { booking: { include: { trip: true, user: true } } },
    }
  )

  res.status(200).json({
    success: true,
    data: payments,
  })
})

const searchPaymentsByReference = catchAsync(async (req, res) => {
  const { search } = req.query
  const page = parseInt(req.query.page!)
  const limit = parseInt(req.query.limit!)

  const payments = await paymentService.findPayments(
    { reference: { contains: search } },
    {
      page,
      limit,
      include: { booking: { include: { trip: true, user: true } } },
    }
  )

  res.status(200).json({
    success: true,
    data: payments,
  })
})

const getPayment = catchAsync(async (req, res) => {
  const { id } = req.params

  const payment = await paymentService.findPayment(
    { id },
    {
      include: {
        booking: {
          include: {
            trip: { include: { vehicle: true, FareCondition: true } },
            Seat: { where: { status: SeatStatus.BOOKED } },
            user: true,
          },
        },
      },
    }
  )
  if (!payment) throw new NotFoundError('Payment not found')

  res.status(200).json({
    success: true,
    data: payment,
  })
})

export default {
  getUsers,
  getUsersByRole,
  searchUsersByName,
  getUser,
  updateUserRole,
  getSeatsByTrip,
  reserveSeat,
  getPayments,
  getPaymentsByStatus,
  getPaymentsByBookingStatus,
  searchPaymentsByReference,
  getPayment,
}

import prisma from '../config/prisma'
import { Booking, Prisma, User } from '@prisma/client'

export type BookingCreateInput = Prisma.BookingCreateInput
export type BookingUpdateInput = Prisma.BookingUpdateInput

const createBooking = async (
  payload: object
): Promise<Booking & { user: User }> => {
  return await prisma.booking.upsert({
    where: { userId_tripId: payload as Booking },
    update: payload,
    create: payload as BookingCreateInput,
    include: { user: true, trip: true },
  })
}

export default {
  createBooking,
}

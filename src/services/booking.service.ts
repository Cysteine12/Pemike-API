import prisma from '../config/prisma'
import { Booking, Prisma, User } from '@prisma/client'

export type BookingCreateInput = Prisma.BookingCreateInput

const createBooking = async (
  payload: Booking
): Promise<Booking & { user: User }> => {
  return await prisma.booking.upsert({
    where: { userId_tripId: payload },
    update: payload,
    create: payload,
    include: { user: true, trip: true },
  })
}

export default {
  createBooking,
}

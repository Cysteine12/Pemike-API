import prisma from '../config/prisma'
import { Booking, Prisma, Trip, User } from '@prisma/client'

export type BookingFindManyArgs = Prisma.BookingFindManyArgs
export type BookingFindUniqueArgs = Prisma.BookingFindUniqueArgs
export type BookingWhereInput = Prisma.BookingWhereInput
export type BookingWhereUniqueInput = Prisma.BookingWhereUniqueInput
export type BookingUncheckedCreateInput = Prisma.BookingUncheckedCreateInput
export type BookingUpdateInput = Prisma.BookingUpdateInput

const findBookings = async (
  filter: BookingWhereInput,
  options?: BookingFindManyArgs & {
    page?: number
    limit?: number
  }
): Promise<Booking[]> => {
  if (options?.page && options?.limit) {
    options.skip = (options?.page - 1) * options?.limit
  }

  return await prisma.booking.findMany({
    where: filter,
    skip: options?.skip || 0,
    take: options?.limit || 20,
    include: { trip: true },
  })
}

const findBooking = async (
  filter: BookingWhereUniqueInput,
  options?: BookingFindUniqueArgs
): Promise<Booking | null> => {
  return await prisma.booking.findUnique({
    where: filter,
    include: { trip: true },
  })
}

const updateOrCreateBooking = async (
  filter: BookingWhereUniqueInput,
  payload: BookingUncheckedCreateInput
): Promise<Booking & { user: User; trip: Trip }> => {
  return await prisma.booking.upsert({
    where: filter,
    update: payload,
    create: payload,
    include: { user: true, trip: true },
  })
}

export default {
  findBookings,
  findBooking,
  updateOrCreateBooking,
}

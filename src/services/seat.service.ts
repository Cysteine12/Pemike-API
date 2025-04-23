import prisma from '../config/prisma'
import { Prisma, Seat } from '@prisma/client'

export type SeatWhereUniqueInput = Prisma.SeatWhereUniqueInput
export type SeatFindManyArgs = Prisma.SeatFindManyArgs
export type SeatFindUniqueArgs = Prisma.SeatFindUniqueArgs
export type SeatWhereInput = Prisma.SeatWhereInput
export type SeatUncheckedCreateInput = Prisma.SeatUncheckedCreateInput
export type SeatUncheckedUpdateManyInput = Prisma.SeatUncheckedUpdateManyInput

const findSeats = async (
  filter: SeatWhereInput,
  options?: SeatFindManyArgs
): Promise<Partial<Seat>[]> => {
  return await prisma.seat.findMany({
    where: filter,
    ...options,
  })
}

const findSeat = async (
  filter: SeatWhereInput,
  options?: SeatFindManyArgs
): Promise<Seat | null> => {
  return await prisma.seat.findFirst({
    where: filter,
    orderBy: options?.orderBy,
  })
}

const updateOrCreateSeat = async (
  filter: SeatWhereUniqueInput,
  payload: SeatUncheckedCreateInput
): Promise<Seat> => {
  return await prisma.seat.upsert({
    where: filter,
    update: payload,
    create: payload,
  })
}

const updateorCreateManySeatsTransaction = async (
  tripId: string,
  seats: SeatUncheckedCreateInput[]
) => {
  return await prisma.$transaction(
    seats.map((seat) =>
      prisma.seat.upsert({
        where: { id: seat.id, tripId, bookingId: null },
        update: {
          status: seat.status,
        },
        create: seat,
      })
    )
  )
}

const updateManySeatsTransaction = async (
  tripId: string,
  seats: Seat[],
  bookingId?: string
) => {
  return await prisma.$transaction(
    seats.map((seat) =>
      prisma.seat.update({
        where: { id: seat.id, tripId, bookingId: null },
        data: {
          passengerType: seat.passengerType,
          bookingId,
        },
      })
    )
  )
}

const updateManySeats = async (
  filter: SeatWhereInput,
  payload: SeatUncheckedUpdateManyInput
) => {
  return await prisma.seat.updateMany({
    where: filter,
    data: payload,
  })
}

export default {
  findSeats,
  findSeat,
  updateOrCreateSeat,
  updateorCreateManySeatsTransaction,
  updateManySeatsTransaction,
  updateManySeats,
}

import prisma from '../config/prisma'
import { Prisma, Seat } from '@prisma/client'
import select from '../utils/select'

export type SeatWhereUniqueInput = Prisma.SeatWhereUniqueInput
export type SeatWhereInput = Prisma.SeatWhereInput

const findSeatsByTrip = async (
  filter: object,
  options: { select: string[] }
): Promise<Partial<Seat>[]> => {
  return await prisma.seat.findMany({
    where: filter,
    select: select(options.select),
  })
}

const updateOrCreateSeat = async (
  filter: any,
  payload: Partial<Seat>
): Promise<Seat> => {
  return await prisma.seat.upsert({
    where: { seatNo_tripId: filter },
    update: payload,
    create: payload as Seat,
  })
}

const updateManySeats = async (filter: object, payload: Partial<Seat>) => {
  return await prisma.seat.updateMany({
    where: filter,
    data: payload,
  })
}

export default {
  findSeatsByTrip,
  updateOrCreateSeat,
  updateManySeats,
}

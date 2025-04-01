import prisma from '../config/prisma'
import { Seat } from '@prisma/client'
import select from '../utils/select'

const findSeatsByTrip = async (
  filter: object,
  options: { select: string[] }
): Promise<Partial<Seat>[]> => {
  return await prisma.seat.findMany({
    where: filter,
    select: select(options.select),
  })
}

const createSeat = async (
  filter: any,
  payload: Partial<Seat>
): Promise<Seat> => {
  return await prisma.seat.upsert({
    where: { seatNo_tripId: filter },
    update: payload,
    create: payload as Seat,
  })
}

export default {
  findSeatsByTrip,
  createSeat,
}

import prisma from '../config/prisma'
import { Seat } from '@prisma/client'

const selectedParams = (keys: string[]): any => {
  return keys.reduce<{ [key: string]: boolean }>((acc, key) => {
    acc[key] = true
    return acc
  }, {})
}

const getSeatsByTrip = async (
  filter: object,
  options: { select: string[] }
): Promise<Partial<Seat>[]> => {
  return await prisma.seat.findMany({
    where: filter,
    select: selectedParams(options.select),
  })
}

const reserveSeat = async (filter: any, payload: Seat): Promise<Seat> => {
  return await prisma.seat.upsert({
    where: { seatNo_tripId: filter },
    update: payload,
    create: payload,
  })
}

export default {
  getSeatsByTrip,
  reserveSeat,
}

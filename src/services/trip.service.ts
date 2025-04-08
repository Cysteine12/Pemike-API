import prisma from '../config/prisma'
import { Prisma, Trip } from '@prisma/client'

export type TripFindManyArgs = Prisma.TripFindManyArgs
export type TripWhereInput = Prisma.TripWhereInput
export type TripWhereUniqueInput = Prisma.TripWhereUniqueInput
export type TripCreateInput = Prisma.TripCreateInput

const findTrips = async (
  filter?: TripWhereInput,
  options?: TripFindManyArgs & {
    page?: number
    limit?: number
  }
): Promise<Trip[]> => {
  if (options?.page && options?.limit) {
    options.skip = (options?.page - 1) * options?.limit
  }

  return await prisma.trip.findMany({
    where: filter,
    skip: options?.skip || 0,
    take: options?.limit || 20,
    include: { vehicle: true },
  })
}

const findTrip = async (filter: TripWhereUniqueInput): Promise<Trip | null> => {
  return await prisma.trip.findUnique({
    where: filter,
    include: { vehicle: true },
  })
}

const createTrip = async (payload: TripCreateInput): Promise<Trip> => {
  return await prisma.trip.create({
    data: payload,
  })
}

export default {
  findTrips,
  findTrip,
  createTrip,
}

import prisma from '../config/prisma'
import { Prisma, Trip } from '@prisma/client'

export type TripWhereInput = Prisma.TripWhereInput
export type TripCreateInput = Prisma.TripCreateInput

const findTrips = async (options: {
  page?: number
  limit?: number
}): Promise<Trip[]> => {
  const { page = 1, limit = 20 } = options

  return await prisma.trip.findMany({
    skip: (page - 1) * limit || 0,
    take: limit || undefined,
    include: { vehicle: true },
  })
}

const searchTrips = async (
  filter: TripWhereInput,
  options: {
    page?: number
    limit?: number
  }
): Promise<Trip[]> => {
  const { page = 1, limit = 20 } = options

  return await prisma.trip.findMany({
    where: {
      AND: [{ source: filter.source }, { destination: filter.destination }],
    },
    skip: (page - 1) * limit || 0,
    take: limit || undefined,
    include: { vehicle: true },
  })
}

const findTripById = async (id: string): Promise<Trip | null> => {
  return await prisma.trip.findUnique({
    where: { id },
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
  searchTrips,
  findTripById,
  createTrip,
}

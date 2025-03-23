import prisma from '../config/prisma'
import { Trip } from '@prisma/client'

const getTrips = async (
  filter: object,
  options: {
    page?: number
    limit?: number
  }
): Promise<Trip[]> => {
  const { page = 1, limit = 20 } = options

  return await prisma.trip.findMany({
    where: filter,
    skip: (page - 1) * limit || 0,
    take: limit || undefined,
    include: { vehicle: true },
  })
}

const getTripById = async (id: string): Promise<Trip | null> => {
  return await prisma.trip.findUnique({
    where: { id },
    include: { vehicle: true },
  })
}

const createTrip = async (payload: Trip): Promise<Trip> => {
  return await prisma.trip.create({
    data: payload,
  })
}

export default {
  getTrips,
  getTripById,
  createTrip,
}

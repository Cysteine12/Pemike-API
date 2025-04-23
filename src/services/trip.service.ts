import prisma from '../config/prisma'
import { Prisma, Trip, FareCondition } from '@prisma/client'
import { tripController } from '../controllers'

export type TripFindManyArgs = Prisma.TripFindManyArgs
export type TripWhereInput = Prisma.TripWhereInput
export type TripWhereUniqueInput = Prisma.TripWhereUniqueInput
export type TripCreateInput = Prisma.TripCreateInput
export type TripUncheckedCreateInput = Prisma.TripUncheckedCreateInput
export type TripUncheckedUpdateInput = Prisma.TripUncheckedUpdateInput

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

const findTrip = async (
  filter: TripWhereUniqueInput
): Promise<(Trip & { FareCondition: FareCondition[] }) | null> => {
  return await prisma.trip.findUnique({
    where: filter,
    include: { vehicle: true, FareCondition: { where: { tripId: filter.id } } },
  })
}

const createTrip = async (payload: TripUncheckedCreateInput): Promise<Trip> => {
  return await prisma.trip.create({
    data: payload,
  })
}

const updateTrip = async (
  filter: TripWhereUniqueInput,
  payload: TripUncheckedUpdateInput
): Promise<Trip> => {
  return await prisma.trip.update({
    where: filter,
    data: payload,
  })
}

const deleteTrip = async (
  filter: TripWhereUniqueInput
): Promise<Trip | null> => {
  return await prisma.trip.delete({
    where: { id: filter.id, FareCondition: { every: { tripId: filter.id } } },
  })
}

export default {
  findTrips,
  findTrip,
  createTrip,
  updateTrip,
  deleteTrip,
}

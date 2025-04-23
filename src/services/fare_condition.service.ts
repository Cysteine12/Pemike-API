import prisma from '../config/prisma'
import { FareCondition, Prisma, Trip } from '@prisma/client'
import { differenceInCalendarWeeks } from 'date-fns'
import tripService from './trip.service'
import { NotFoundError } from '../middlewares/errorHandler'

export type FareConditionFindManyArgs = Prisma.FareConditionFindManyArgs
export type FareConditionWhereInput = Prisma.FareConditionWhereInput
export type FareConditionWhereUniqueInput = Prisma.FareConditionWhereUniqueInput
export type FareConditionCreateWithoutTripInput =
  Prisma.FareConditionCreateWithoutTripInput

const findFareConditionsByTrip = async (
  filter: FareConditionWhereInput,
  options?: FareConditionFindManyArgs
): Promise<FareCondition[]> => {
  return await prisma.fareCondition.findMany({
    where: filter,
  })
}

const findFareConditionByTrip = async (
  filter: FareConditionWhereUniqueInput
): Promise<FareCondition | null> => {
  return await prisma.fareCondition.findUnique({
    where: filter,
  })
}

const findMatchingFareConditionForTrip = async (
  tripId: string
): Promise<FareCondition> => {
  const trip = await tripService.findTrip({ id: tripId })
  if (!trip) throw new NotFoundError('Trip not found')

  const getWeeksLeft = () => {
    const now = new Date()
    const targetDate = new Date(trip.departureSchedule)

    const diffInMs = targetDate.getTime() - now.getTime()
    if (diffInMs <= 0) return 0

    const diffInWeeks = diffInMs / (1000 * 60 * 60 * 24 * 7)
    return diffInWeeks
  }

  const weeksLeft = getWeeksLeft()

  return trip.FareCondition.filter((fareCondition) => {
    if (
      fareCondition.maxWeeksBefore === null &&
      weeksLeft > fareCondition.minWeeksBefore
    )
      return true

    if (
      fareCondition.maxWeeksBefore &&
      fareCondition.maxWeeksBefore >= weeksLeft &&
      weeksLeft >= fareCondition.minWeeksBefore
    )
      return true

    return false
  })[0]
}

const findMatchingFareConditionByTrip = async (
  tripId: string,
  tripSchedule: Date
): Promise<FareCondition | null> => {
  const weeksBefore = differenceInCalendarWeeks(tripSchedule, new Date())
  console.log(tripSchedule, new Date())

  let fareCondition = await prisma.fareCondition.findFirst({
    where: {
      tripId,
      minWeeksBefore: { lte: weeksBefore },
      OR: [{ maxWeeksBefore: null }, { maxWeeksBefore: { gte: weeksBefore } }],
    },
    orderBy: { minWeeksBefore: 'desc' },
  })

  if (!fareCondition) {
    fareCondition = await prisma.fareCondition.findFirst({
      where: { tripId },
      orderBy: { minWeeksBefore: 'asc' },
    })
  }

  return fareCondition
}

export default {
  findFareConditionsByTrip,
  findFareConditionByTrip,
  findMatchingFareConditionForTrip,
  findMatchingFareConditionByTrip,
}

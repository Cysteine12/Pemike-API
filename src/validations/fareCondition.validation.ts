import { FareConditionLabel } from '@prisma/client'
import { z } from 'zod'

const createFareConditionSchema = z.object({
  conditionLabel: z.enum([
    FareConditionLabel.WEEK_0_TO_2,
    FareConditionLabel.WEEK_2_TO_4,
    FareConditionLabel.WEEK_MORE_THAN_4,
  ]),
  adultPrice: z.number(),
  childPrice: z.number(),
  infantPrice: z.number(),
  maxWeeksBefore: z.number().nullable(),
  minWeeksBefore: z.number(),
  cancelLessThan48h: z.number(),
})

export type CreateFareConditionSchema = z.infer<
  typeof createFareConditionSchema
>

export default {
  createFareConditionSchema,
}

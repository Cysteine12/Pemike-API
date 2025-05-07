import { z } from 'zod'
import fareConditionValidation from './fareCondition.validation'

const createTripSchema = z.object({
  source: z.string(),
  destination: z.string(),
  departureSchedule: z.string().datetime(),
  firstChangePercent: z.string(),
  secondChangePercent: z.string(),
  refundDays: z.number(),
  driverId: z.string().uuid(),
  vehicleId: z.string().uuid(),
  fareConditions: z.array(fareConditionValidation.createFareConditionSchema),
})

export type CreateTripSchema = z.infer<typeof createTripSchema>

const updateTripSchema = createTripSchema
  .partial()
  .omit({ fareConditions: true })

export type UpdateTripSchema = z.infer<typeof updateTripSchema>

export default {
  createTripSchema,
  updateTripSchema,
}

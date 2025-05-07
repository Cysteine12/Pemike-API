import { PassengerType } from '@prisma/client'
import { z } from 'zod'

const createBookingSchema = z.object({
  sessionID: z.string().uuid(),
  tripId: z.string().uuid(),
  seats: z.array(
    z.object({
      id: z.string().uuid(),
      passengerType: z.enum([
        PassengerType.ADULT_WITHOUT_INFANT,
        PassengerType.ADULT_WITH_INFANT,
        PassengerType.CHILD,
      ]),
    })
  ),
})

export type CreateBookingSchema = z.infer<typeof createBookingSchema>

export default {
  createBookingSchema,
}

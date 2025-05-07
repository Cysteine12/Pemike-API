import { z } from 'zod'

const initializePaymentSchema = z.object({
  sessionID: z.string().uuid(),
  tripId: z.string().uuid(),
  bookingId: z.string().uuid(),
})

export type InitializePaymentSchema = z.infer<typeof initializePaymentSchema>

export default {
  initializePaymentSchema,
}

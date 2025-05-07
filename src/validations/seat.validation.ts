import { SeatStatus } from '@prisma/client'
import { z } from 'zod'

const reserveSeatSchema = z.object({
  sessionID: z.string().uuid().nullable(),
  tripId: z.string().uuid(),
  seatNo: z.number(),
})

export type ReserveSeatSchema = z.infer<typeof reserveSeatSchema>

const reserveAdminSeatSchema = z.object({
  tripId: z.string().uuid(),
  seatNo: z.number(),
  status: z.enum([SeatStatus.AVAILABLE, SeatStatus.BOOKED]),
})

export type ReserveAdminSeatSchema = z.infer<typeof reserveAdminSeatSchema>

export default {
  reserveSeatSchema,
  reserveAdminSeatSchema,
}

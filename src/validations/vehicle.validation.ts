import { VehicleCategory } from '@prisma/client'
import { z } from 'zod'

const createVehicleSchema = z.object({
  category: z.enum([VehicleCategory.BUS, VehicleCategory.CAR]),
  brand: z.string(),
  model: z.string(),
  licenseNo: z.string(),
  thumbnail: z.string(),
  totalPassengerSeat: z.number(),
  available: z.boolean(),
})

export type CreateVehicleSchema = z.infer<typeof createVehicleSchema>

const updateVehicleSchema = z.object({
  category: z.enum([VehicleCategory.BUS, VehicleCategory.CAR]),
  brand: z.string(),
  model: z.string(),
  licenseNo: z.string(),
  thumbnail: z.string(),
  totalPassengerSeat: z.number(),
  available: z.boolean(),
})

export type UpdateVehicleSchema = z.infer<typeof updateVehicleSchema>

export default {
  createVehicleSchema,
  updateVehicleSchema,
}

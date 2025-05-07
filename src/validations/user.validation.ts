import { z } from 'zod'
import { UserGender, UserRole } from '@prisma/client'

const updateProfileSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  gender: z.enum([UserGender.MALE, UserGender.FEMALE]),
})

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>

const updateUserRoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum([UserRole.ADMIN, UserRole.CUSTOMER, UserRole.DRIVER]),
})

export type UpdateUserRoleSchema = z.infer<typeof updateUserRoleSchema>

export default {
  updateProfileSchema,
  updateUserRoleSchema,
}

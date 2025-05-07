import { UserGender } from '@prisma/client'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  password: z.string().min(7),
  gender: z.enum([UserGender.MALE, UserGender.FEMALE]),
  phone: z.string().min(11).max(11),
})

export type RegisterSchema = z.infer<typeof registerSchema>

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(7),
})

export type LoginSchema = z.infer<typeof loginSchema>

const verifyEmailSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(6).max(6),
})

export type VerifyEmailSchema = z.infer<typeof verifyEmailSchema>

const forgotPasswordSchema = z.object({
  email: z.string().email(),
})

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>

const resetPasswordSchema = z.object({
  email: z.string().email(),
  password: z.string().min(7),
  otp: z.string().min(6).max(6),
})

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>

const changePasswordSchema = z.object({
  currentPassword: z.string().min(7),
  newPassword: z.string().min(7),
})

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>

const requestOTPSchema = z.object({
  email: z.string().email(),
})

export type RequestOTPSchema = z.infer<typeof requestOTPSchema>

const verifyOTPSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(6).max(6),
})

export type VerifyOTPSchema = z.infer<typeof verifyOTPSchema>

export default {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  requestOTPSchema,
  verifyOTPSchema,
}

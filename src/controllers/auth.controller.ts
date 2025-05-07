import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {
  CacheAPIError,
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError,
  ValidationError,
} from '../middlewares/errorHandler'
import {
  authService,
  emailService,
  tokenService,
  userService,
} from '../services'
import { User } from '@prisma/client'
import {
  ChangePasswordSchema,
  ForgotPasswordSchema,
  LoginSchema,
  RegisterSchema,
  RequestOTPSchema,
  ResetPasswordSchema,
  VerifyEmailSchema,
  VerifyOTPSchema,
} from '../validations/auth.validation'
import catchAsync from '../utils/catchAsync'
import pick from '../utils/pick'
import exclude from '../utils/exclude'
import cache from '../config/cache'
import { config } from '../config/config'
import { cookieConfig } from '../utils/cookieConfig'

const register = catchAsync(async (req, res) => {
  const payload: RegisterSchema = req.body
  let newUser = pick(payload, [
    'firstName',
    'lastName',
    'email',
    'phone',
    'gender',
    'password',
  ])

  const user = await userService.findUser({ email: newUser.email })
  if (user) throw new ValidationError('This email already exists')

  const salt = await bcrypt.genSalt(10)
  newUser.password = await bcrypt.hash(newUser.password, salt)

  const savedUser = await userService.createUser(newUser)

  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  const isCached = cache.set(
    newUser.email,
    otp,
    config.jwt.VERIFY_EMAIL_EXPIRATION_HOURS * 60 * 60
  )
  if (!isCached) throw new CacheAPIError('An Error Ocurred')

  await emailService.sendEmailVerificationRequestMail(savedUser, otp)

  res.status(201).json({
    success: true,
    message:
      'Registration successful. Please check your email to verify your account.',
  })
})

const login = catchAsync(async (req, res) => {
  const { email, password }: LoginSchema = req.body

  let user = await authService.findUser({ email: email })
  if (!user) throw new NotFoundError('Invalid credentials')

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) throw new ValidationError('Invalid credentials')

  if (!user.isVerified) throw new ValidationError('verify-email')

  const { access, refresh } = await tokenService.generateAndSaveAuthTokens(
    user.id,
    user.role
  )

  res.cookie('accessToken', access.token, cookieConfig(access.expires))
  res.cookie('refreshToken', refresh.token, cookieConfig(refresh.expires))

  let filteredUser = exclude<User>(user, ['password', 'createdAt', 'updatedAt'])

  res.status(200).json({
    success: true,
    message: 'Login successful',
    user: filteredUser,
  })
})

const verifyEmail = catchAsync(async (req, res) => {
  const { email, otp }: VerifyEmailSchema = req.body

  const cachedOTP = cache.take(email)
  if (!cachedOTP) throw new NotFoundError('Expired OTP, Try Again!')

  if (cachedOTP !== String(otp)) {
    throw new ValidationError('Wrong code, Try Again!')
  }

  const updatedUser = await userService.updateUser(
    { email },
    { isVerified: true }
  )

  await emailService.sendWelcomeMail(updatedUser.email, updatedUser.firstName)

  res.status(200).json({
    success: true,
    message: 'Email verified successfully',
  })
})

const forgotPassword = catchAsync(async (req, res) => {
  const { email }: ForgotPasswordSchema = req.body

  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  const isCached = cache.set(
    email,
    otp,
    config.jwt.RESET_PASSWORD_EXPIRATION_MINUTES * 60 * 60
  )
  if (!isCached) throw new CacheAPIError('An Error Ocurred')

  await emailService.sendForgotPasswordMail(email, otp)

  res.status(200).json({
    success: true,
    message: 'Kindly check your email for the code',
  })
})

const resetPassword = catchAsync(async (req, res) => {
  const { email, password, otp }: ResetPasswordSchema = req.body

  const cachedOTP = cache.take(email)
  if (!cachedOTP) throw new NotFoundError('Expired OTP, Try Again!')

  if (cachedOTP !== String(otp)) {
    throw new ValidationError('Wrong code, Try Again!')
  }

  const salt = await bcrypt.genSalt(10)
  const newPassword = await bcrypt.hash(password, salt)

  const updatedUser = await userService.updateUser(
    { email },
    { password: newPassword }
  )

  await emailService.sendPasswordChangedMail(
    updatedUser.email,
    updatedUser.firstName
  )

  res.status(200).json({
    success: true,
    message: 'Email verified successfully',
  })
})

const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword }: ChangePasswordSchema = req.body
  const { id } = req.user!

  let user = await authService.findUser({ id })
  if (!user || !user.password) throw new NotFoundError('User not found')

  const isMatch = await bcrypt.compare(currentPassword, user.password)
  if (!isMatch) throw new ValidationError('Incorrect password')

  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(newPassword, salt)

  await userService.updateUser({ id }, user)

  await emailService.sendPasswordChangedMail(user.email, user.firstName)

  res.status(200).json({
    success: true,
    message: 'Password has been changed successfully',
  })
})

const refreshToken = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken

  if (!refreshToken) throw new ValidationError('No refresh token')

  jwt.verify(
    refreshToken,
    config.jwt.REFRESH_TOKEN_SECRET,
    async (err: any, payload: any) => {
      if (err) throw new ValidationError('Invalid or expired token')

      const { access, refresh } = await tokenService.generateAndSaveAuthTokens(
        payload.sub,
        payload.role
      )

      res.cookie('accessToken', access.token, cookieConfig(access.expires))
      res.cookie('refreshToken', refresh.token, cookieConfig(refresh.expires))

      res.status(200).json({
        success: true,
        message: 'Tokens refreshed successfully',
      })
    }
  )
})

const requestOTP = catchAsync(async (req, res) => {
  const { email }: RequestOTPSchema = req.body

  const otp = Math.floor(100000 + Math.random() * 900000).toString()

  const isCached = cache.set(email, otp, config.OTP_EXPIRATION_MINUTES * 60)
  if (!isCached) throw new CacheAPIError('An Error Ocurred')

  await emailService.sendUserVerificationOTP(email, otp)

  res.status(201).json({
    success: true,
  })
})

const verifyOTP = catchAsync(async (req, res) => {
  const { email, otp }: VerifyOTPSchema = req.body

  const cachedOTP = cache.take(email)
  if (!cachedOTP) throw new NotFoundError('Expired OTP, Try Again!')

  if (cachedOTP !== String(otp)) {
    throw new ValidationError('Wrong code, Try Again!')
  }

  res.status(201).json({
    success: true,
  })
})

const logout = catchAsync(async (req, res) => {
  res.clearCookie('accessToken')
  res.clearCookie('refreshToken')

  res.status(200).json({
    success: true,
    message: 'Logout successful',
  })
})

export default {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  refreshToken,
  requestOTP,
  verifyOTP,
  logout,
}

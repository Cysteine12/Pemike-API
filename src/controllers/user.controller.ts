import { User } from '@prisma/client'
import { tokenService, userService } from '../services'
import { UserCreateInput } from '../services/user.service'
import catchAsync from '../utils/catchAsync'
import { cookieConfig } from '../utils/cookieConfig'
import exclude from '../utils/exclude'
import pick from '../utils/pick'

const getProfile = catchAsync((req, res) => {
  let user = req.user as User

  const filteredUser = exclude(user, ['password', 'createdAt', 'updatedAt'])

  res.status(200).json({
    success: true,
    user: filteredUser,
  })
})

const createProfile = catchAsync(async (req, res) => {
  const newUser = pick(req.body, [
    'firstName',
    'lastName',
    'email',
    'phone',
    'gender',
  ]) as UserCreateInput

  const savedUser = await userService.createOrUpdateUser(newUser)

  const { access, refresh } = await tokenService.generateAndSaveAuthTokens(
    savedUser.id
  )

  res.cookie('accessToken', access.token, cookieConfig(access.expires))
  res.cookie('refreshToken', refresh.token, cookieConfig(refresh.expires))

  const user = exclude(savedUser, ['password', 'createdAt', 'updatedAt'])

  res.status(200).json({
    success: true,
    message: 'Profile created successfully',
    user: user,
  })
})

export default {
  getProfile,
  createProfile,
}

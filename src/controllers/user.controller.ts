import { userService } from '../services'
import catchAsync from '../utils/catchAsync'
import exclude from '../utils/exclude'
import pick from '../utils/pick'

const getProfile = catchAsync((req, res) => {
  const user = req.user!

  const filteredUser = exclude(user, ['password', 'createdAt', 'updatedAt'])

  res.status(200).json({
    success: true,
    user: filteredUser,
  })
})

const updateProfile = catchAsync(async (req, res) => {
  const { id } = req.user!
  const newUser = pick(req.body, ['firstName', 'lastName', 'phone', 'gender'])

  const updatedUser = await userService.updateUser({ id }, newUser)

  const filteredUser = exclude(updatedUser, [
    'password',
    'createdAt',
    'updatedAt',
  ])

  res.status(200).json({
    success: true,
    user: filteredUser,
    message: 'Profile updated successfully',
  })
})

export default {
  getProfile,
  updateProfile,
}

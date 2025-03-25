import { userService } from '../services'
import catchAsync from '../utils/catchAsync'
import exclude from '../utils/exclude'
import pick from '../utils/pick'

const createUser = catchAsync(async (req, res) => {
  const newUser = pick(req.body, [
    'firstName',
    'lastName',
    'email',
    'phone',
    'gender',
  ])

  const savedUser = await userService.createUser(newUser)

  const user = exclude(savedUser, ['password', 'createdAt', 'updatedAt'])

  res.status(200).json({
    success: true,
    message: 'Profile created successfully',
    data: user,
  })
})

export default {
  createUser,
}

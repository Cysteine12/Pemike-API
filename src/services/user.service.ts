import prisma from '../config/prisma'
import { User } from '@prisma/client'

const createUser = async (payload: User): Promise<User> => {
  return await prisma.user.upsert({
    where: { email: payload.email },
    update: payload,
    create: payload,
  })
}

export default {
  createUser,
}

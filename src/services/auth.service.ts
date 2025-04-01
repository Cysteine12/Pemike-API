import prisma from '../config/prisma'
import { Prisma, User } from '@prisma/client'

export type UserWhereUniqueInput = Prisma.UserWhereUniqueInput

const findUser = async (
  payload: UserWhereUniqueInput
): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: payload,
  })
}

export default {
  findUser,
}

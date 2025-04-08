import prisma from '../config/prisma'
import { Prisma, User } from '@prisma/client'

export type UserCreateInput = Prisma.UserCreateInput
export type UserFindUniqueArgs = Prisma.UserFindUniqueArgs
export type UserUpdateInput = Prisma.UserUpdateInput
export type UserWhereUniqueInput = Prisma.UserWhereUniqueInput

const findUser = async (
  filter: UserWhereUniqueInput,
  options?: UserFindUniqueArgs
): Promise<Partial<User> | null> => {
  return await prisma.user.findUnique({
    where: filter,
    select: options?.select,
  })
}

const createUser = async (payload: UserCreateInput): Promise<User> => {
  return await prisma.user.create({
    data: payload,
  })
}

const updateUser = async (
  filter: UserWhereUniqueInput,
  payload: UserUpdateInput
): Promise<User> => {
  return await prisma.user.update({
    where: filter,
    data: payload,
  })
}

export default {
  findUser,
  createUser,
  updateUser,
}

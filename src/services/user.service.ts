import prisma from '../config/prisma'
import { Prisma, User } from '@prisma/client'

export type UserWhereInput = Prisma.UserWhereInput
export type UserFindManyArgs = Prisma.UserFindManyArgs
export type UserCreateInput = Prisma.UserCreateInput
export type UserFindUniqueArgs = Prisma.UserFindUniqueArgs
export type UserUpdateInput = Prisma.UserUpdateInput
export type UserWhereUniqueInput = Prisma.UserWhereUniqueInput

const findUsers = async (
  filter: UserWhereInput,
  options?: UserFindManyArgs & {
    page?: number
    limit?: number
  }
): Promise<Omit<User, 'password'>[]> => {
  if (options?.page && options?.limit) {
    options.skip = (options?.page - 1) * options?.limit
  }

  return await prisma.user.findMany({
    where: filter,
    skip: options?.skip || 0,
    take: options?.limit || 20,
    omit: { password: true },
  })
}

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
  findUsers,
  findUser,
  createUser,
  updateUser,
}

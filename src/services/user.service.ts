import prisma from '../config/prisma'
import { Prisma, User } from '@prisma/client'
import select from '../utils/select'

export type UserCreateInput = Prisma.UserCreateInput
export type UserUpdateInput = Prisma.UserUpdateInput
export type UserWhereUniqueInput = Prisma.UserWhereUniqueInput

const findUser = async (
  filter: UserWhereUniqueInput,
  options?: { select: string[] }
): Promise<Partial<User> | null> => {
  return await prisma.user.findUnique({
    where: filter,
    select: select(options?.select),
  })
}

const createUser = async (payload: UserCreateInput): Promise<User> => {
  return await prisma.user.create({
    data: payload,
  })
}

const createOrUpdateUser = async (payload: UserCreateInput): Promise<User> => {
  return await prisma.user.upsert({
    where: { email: payload.email },
    update: payload,
    create: payload,
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
  createOrUpdateUser,
  updateUser,
}

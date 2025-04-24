import prisma from '../config/prisma'
import { Prisma, Vehicle } from '@prisma/client'

export type VehicleFindManyArgs = Prisma.VehicleFindManyArgs
export type VehicleWhereInput = Prisma.VehicleWhereInput
export type VehicleWhereUniqueInput = Prisma.VehicleWhereUniqueInput
export type VehicleCreateInput = Prisma.VehicleCreateInput
export type VehicleUncheckedCreateInput = Prisma.VehicleUncheckedCreateInput
export type VehicleUncheckedUpdateInput = Prisma.VehicleUncheckedUpdateInput

const findVehicles = async (
  filter?: VehicleWhereInput,
  options?: VehicleFindManyArgs & {
    page?: number
    limit?: number
  }
): Promise<Vehicle[]> => {
  if (options?.page && options?.limit) {
    options.skip = (options?.page - 1) * options?.limit
  }

  return await prisma.vehicle.findMany({
    where: filter,
    skip: options?.skip || 0,
    take: options?.limit || 20,
  })
}

const findVehicle = async (
  filter: VehicleWhereUniqueInput
): Promise<Vehicle | null> => {
  return await prisma.vehicle.findUnique({
    where: filter,
  })
}

const createVehicle = async (
  payload: VehicleUncheckedCreateInput
): Promise<Vehicle> => {
  return await prisma.vehicle.create({
    data: payload,
  })
}

const updateVehicle = async (
  filter: VehicleWhereUniqueInput,
  payload: VehicleUncheckedUpdateInput
): Promise<Vehicle> => {
  return await prisma.vehicle.update({
    where: filter,
    data: payload,
  })
}

const deleteVehicle = async (
  filter: VehicleWhereUniqueInput
): Promise<Vehicle | null> => {
  return await prisma.vehicle.delete({
    where: filter,
  })
}

export default {
  findVehicles,
  findVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
}

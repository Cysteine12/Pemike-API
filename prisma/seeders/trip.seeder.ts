import prisma from '../../src/config/prisma'
import logger from '../../src/middlewares/logger'

const main = async () => {
  await prisma.trip.createMany({
    data: [
      // {
      //   fare: 15000,
      //   source: 'Osogbo Garage',
      //   destination: 'Agege Bus stop',
      //   departureSchedule: '2025-03-10T02:07:58.706Z',
      //   driverId: 'cc78ac2c-aea3-41c3-b2f8-f4f6397ce8ec',
      //   vehicleId: 'f545a2c9-ad25-4731-991a-3e7a282f984b',
      // },
      // {
      //   fare: 7000,
      //   source: 'New Trade Park',
      //   destination: 'Onitsha Bus stop',
      //   departureSchedule: '2025-03-17T02:07:58.706Z',
      //   driverId: 'cc78ac2c-aea3-41c3-b2f8-f4f6397ce8ec',
      //   vehicleId: 'e10bd071-3fa3-4415-89d3-b166e8082081',
      // },
      {
        fare: 8500,
        source: 'Ilesha Garage, Osun',
        destination: 'Owo, Ondo',
        departureSchedule: '2025-04-02T02:07:58.706Z',
        driverId: 'cc78ac2c-aea3-41c3-b2f8-f4f6397ce8ec',
        vehicleId: 'f545a2c9-ad25-4731-991a-3e7a282f984b',
      },
      {
        fare: 7700,
        source: 'New Trade Park, Iwo Road',
        destination: 'Challenge Bus stop, Ibadan, Oyo',
        departureSchedule: '2025-04-17T02:07:58.706Z',
        driverId: 'cc78ac2c-aea3-41c3-b2f8-f4f6397ce8ec',
        vehicleId: 'e10bd071-3fa3-4415-89d3-b166e8082081',
      },
      {
        fare: 12000,
        source: 'Iyanapaja Brigde, Lagos',
        destination: 'Ado-Ekiti',
        departureSchedule: '2025-03-19T02:07:58.706Z',
        driverId: 'cc78ac2c-aea3-41c3-b2f8-f4f6397ce8ec',
        vehicleId: 'f545a2c9-ad25-4731-991a-3e7a282f984b',
      },
      {
        fare: 7000,
        source: 'Abu Park, Zaria, Kaduna',
        destination: 'Ikeja, Lagos',
        departureSchedule: '2025-04-07T02:07:58.706Z',
        driverId: 'cc78ac2c-aea3-41c3-b2f8-f4f6397ce8ec',
        vehicleId: 'e10bd071-3fa3-4415-89d3-b166e8082081',
      },
    ],
  })
}

main()
  .then(async () => {
    logger.info('Trip table seeded successfully!')
    await prisma.$disconnect()
    process.exit(1)
  })
  .catch(async (err) => {
    logger.error(err)
    await prisma.$disconnect()
  })

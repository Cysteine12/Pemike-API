import prisma from '../../src/config/prisma'
import logger from '../../src/middlewares/logger'

const main = async () => {
  await prisma.trip.createMany({
    data: [
      {
        source: 'Ikorodu, Lagos',
        destination: 'Asaba, Onitsha',
        departureSchedule: '2025-04-27T06:00:00.706Z',
        driverId: 'c3f80e12-d073-4c79-bcdd-2dfccc5559e2',
        vehicleId: 'c9696656-83ea-43fa-8c0e-5f1d02f778f0',
        secondChangePercent: 10,
        refundDays: 5,
      },
      {
        source: 'Osogbo Garage',
        destination: 'Agege Bus stop',
        departureSchedule: '2025-04-20T02:07:58.706Z',
        driverId: 'c3f80e12-d073-4c79-bcdd-2dfccc5559e2',
        vehicleId: 'c9696656-83ea-43fa-8c0e-5f1d02f778f0',
        secondChangePercent: 10,
        refundDays: 5,
      },
      {
        source: 'New Trade Park',
        destination: 'Onitsha Bus stop',
        departureSchedule: '2025-05-17T02:07:58.706Z',
        driverId: 'c3f80e12-d073-4c79-bcdd-2dfccc5559e2',
        vehicleId: '58dd9bce-43ff-4eef-a696-1a74756f45c0',
        secondChangePercent: 10,
        refundDays: 5,
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

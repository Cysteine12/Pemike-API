import prisma from '../../src/config/prisma'
import logger from '../../src/middlewares/logger'

const main = async () => {
  await prisma.vehicle.createMany({
    data: [
      {
        category: 'bus',
        brand: 'Toyota',
        model: 'Hiace',
        licenseNo: 'FM246ABJ',
        totalPassengerSeat: 14,
      },
      {
        category: 'car',
        brand: 'Nissan',
        model: 'Camry',
        licenseNo: 'LK276AGG',
        totalPassengerSeat: 5,
      },
    ],
  })
}

main()
  .then(async () => {
    logger.info('Vehicle table seeded successfully!')
    await prisma.$disconnect()
    process.exit(1)
  })
  .catch(async (err) => {
    logger.error(err)
    await prisma.$disconnect()
  })

import prisma from '../../src/config/prisma'
import logger from '../../src/middlewares/logger'

const main = async () => {
  await prisma.vehicle.createMany({
    data: [
      {
        category: 'BUS',
        brand: 'Toyota',
        model: 'Hiace',
        licenseNo: 'FM246ABJ',
        totalPassengerSeat: 14,
        thumbnail:
          'https://res.cloudinary.com/dbjghnlke/image/upload/v1739551140/mega-automotives/app/rentals/eeowf5iokm0l3igqaqyw.webp',
      },
      {
        category: 'CAR',
        brand: 'Nissan',
        model: 'Camry',
        licenseNo: 'LK276AGG',
        totalPassengerSeat: 5,
        thumbnail:
          'https://res.cloudinary.com/dbjghnlke/image/upload/v1739551140/mega-automotives/app/rentals/eeowf5iokm0l3igqaqyw.webp',
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

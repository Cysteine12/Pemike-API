import prisma from '../../src/config/prisma'
import logger from '../../src/middlewares/logger'

const main = async () => {
  await prisma.seat.createMany({
    data: [
      {
        seatNo: 4,
        status: 'booked',
        tripId: '1ed4c595-67ec-49cd-a69b-c93a3657faf7',
      },
      {
        seatNo: 7,
        status: 'booked',
        tripId: '1ed4c595-67ec-49cd-a69b-c93a3657faf7',
      },
    ],
  })
}

main()
  .then(async () => {
    logger.info('Seat table seeded successfully!')
    await prisma.$disconnect()
    process.exit(1)
  })
  .catch(async (err) => {
    console.log(err)
    logger.error(err)
    await prisma.$disconnect()
  })

import prisma from '../../src/config/prisma'
import logger from '../../src/middlewares/logger'

const main = async () => {
  await prisma.seat.createMany({
    data: [
      {
        seatNo: 4,
        status: 'BOOKED',
        tripId: '2fd543c9-209b-46fb-90cb-7e21bd83006e',
      },
      {
        seatNo: 7,
        status: 'BOOKED',
        tripId: '2fd543c9-209b-46fb-90cb-7e21bd83006e',
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

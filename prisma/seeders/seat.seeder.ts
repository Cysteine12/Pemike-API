import prisma from '../../src/config/prisma'
import logger from '../../src/middlewares/logger'

const main = async () => {
  await prisma.seat.createMany({
    data: [
      {
        seatNo: 4,
        status: 'BOOKED',
        tripId: '6fc87f21-c65c-4fcf-b889-2451fee03a1c',
        passengerType: 'CHILD',
      },
      {
        seatNo: 7,
        status: 'BOOKED',
        tripId: '6fc87f21-c65c-4fcf-b889-2451fee03a1c',
        passengerType: 'ADULT_WITHOUT_INFANT',
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

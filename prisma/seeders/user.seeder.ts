import prisma from '../../src/config/prisma'
import logger from '../../src/middlewares/logger'

const main = async () => {
  await prisma.user.createMany({
    data: [
      {
        email: 'gbengabp12@gmail.com',
        firstName: 'Gbenga',
        lastName: 'Balogun',
        password: 'test1234',
        gender: 'MALE',
        phone: '07064556534',
        isVerified: true,
      },
      {
        email: 'test@gmail.com',
        firstName: 'test',
        lastName: 'test',
        password: 'test1234',
        gender: 'FEMALE',
        phone: '07064556534',
        isVerified: true,
      },
      {
        email: 'thewebstacker@gmail.com',
        firstName: 'Admin',
        lastName: 'Main',
        password: 'test1234',
        gender: 'MALE',
        phone: '07064556534',
        isVerified: true,
        role: 'ADMIN',
      },
      {
        email: 'driver@gmail.com',
        firstName: 'Musa',
        lastName: 'Salahu',
        password: 'test1234',
        gender: 'MALE',
        role: 'DRIVER',
        phone: '07064556534',
        isVerified: true,
      },
    ],
  })
}

main()
  .then(async () => {
    logger.info('User table seeded successfully!')
    await prisma.$disconnect()
    process.exit(1)
  })
  .catch(async (err) => {
    logger.error(err)
    await prisma.$disconnect()
  })

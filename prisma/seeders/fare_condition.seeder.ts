import prisma from '../../src/config/prisma'
import logger from '../../src/middlewares/logger'

const main = async () => {
  await prisma.fareCondition.createMany({
    data: [
      // {
      //   adultPrice: 47300,
      //   childPrice: 37300,
      //   infantPrice: 4730,
      //   cancelLessThan48h: 20,
      //   conditionLabel: 'WEEK_0_TO_2',
      //   minWeeksBefore: 0,
      //   maxWeeksBefore: 2,
      //   tripId: '6fc87f21-c65c-4fcf-b889-2451fee03a1c',
      // },
      // {
      //   adultPrice: 44300,
      //   childPrice: 34300,
      //   infantPrice: 4730,
      //   cancelLessThan48h: 30,
      //   conditionLabel: 'WEEK_2_TO_4',
      //   minWeeksBefore: 2,
      //   maxWeeksBefore: 4,
      //   tripId: '6fc87f21-c65c-4fcf-b889-2451fee03a1c',
      // },
      // {
      //   adultPrice: 42300,
      //   childPrice: 32300,
      //   infantPrice: 4730,
      //   cancelLessThan48h: 30,
      //   conditionLabel: 'WEEK_MORE_THAN_4',
      //   minWeeksBefore: 4,
      //   tripId: '6fc87f21-c65c-4fcf-b889-2451fee03a1c',
      // },
      // {
      //   adultPrice: 23400,
      //   childPrice: 13400,
      //   infantPrice: 4730,
      //   cancelLessThan48h: 20,
      //   conditionLabel: 'WEEK_0_TO_2',
      //   minWeeksBefore: 0,
      //   maxWeeksBefore: 2,
      //   tripId: '248e09d7-f020-4278-982b-6052ad1c2337',
      // },
      // {
      //   adultPrice: 20400,
      //   childPrice: 10400,
      //   infantPrice: 4730,
      //   cancelLessThan48h: 30,
      //   conditionLabel: 'WEEK_2_TO_4',
      //   minWeeksBefore: 2,
      //   maxWeeksBefore: 4,
      //   tripId: '248e09d7-f020-4278-982b-6052ad1c2337',
      // },
      // {
      //   adultPrice: 18400,
      //   childPrice: 8400,
      //   infantPrice: 4730,
      //   cancelLessThan48h: 30,
      //   conditionLabel: 'WEEK_MORE_THAN_4',
      //   minWeeksBefore: 4,
      //   tripId: '248e09d7-f020-4278-982b-6052ad1c2337',
      // },
      {
        adultPrice: 43400,
        childPrice: 43400,
        infantPrice: 4730,
        cancelLessThan48h: 20,
        conditionLabel: 'WEEK_0_TO_2',
        minWeeksBefore: 0,
        maxWeeksBefore: 2,
        tripId: 'a6e856fe-ce67-435c-89d5-e0b8e14616fc',
      },
      {
        adultPrice: 30400,
        childPrice: 30400,
        infantPrice: 4730,
        cancelLessThan48h: 30,
        conditionLabel: 'WEEK_2_TO_4',
        minWeeksBefore: 2,
        maxWeeksBefore: 4,
        tripId: 'a6e856fe-ce67-435c-89d5-e0b8e14616fc',
      },
      {
        adultPrice: 28400,
        childPrice: 18400,
        infantPrice: 4730,
        cancelLessThan48h: 30,
        conditionLabel: 'WEEK_MORE_THAN_4',
        minWeeksBefore: 4,
        tripId: 'a6e856fe-ce67-435c-89d5-e0b8e14616fc',
      },
    ],
  })
}

main()
  .then(async () => {
    logger.info('Fare condition table seeded successfully!')
    await prisma.$disconnect()
    process.exit(1)
  })
  .catch(async (err) => {
    console.log(err)
    logger.error(err)
    await prisma.$disconnect()
  })

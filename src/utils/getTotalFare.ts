import { FareCondition, PassengerType, Seat } from '@prisma/client'

const getTotalFare = (seats: Seat[], fareCondition: FareCondition) => {
  return seats.reduce((pre: number, cur: Seat) => {
    if (cur.passengerType === PassengerType.CHILD) {
      return pre + fareCondition.childPrice
    } else if (cur.passengerType === PassengerType.ADULT_WITHOUT_INFANT) {
      return pre + fareCondition.adultPrice
    }
    return pre + fareCondition.adultPrice + fareCondition.infantPrice
  }, 0)
}

export { getTotalFare }

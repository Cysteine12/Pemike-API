import axios from 'axios'
import prisma from '../config/prisma'
import { Payment, Prisma } from '@prisma/client'
import { config } from '../config/config'

export type PaymentCreateInput = Prisma.PaymentCreateInput

const findPaymentById = async (id: string): Promise<Payment | null> => {
  return await prisma.payment.findUnique({
    where: { id },
    include: { booking: true },
  })
}

const initializePayment = async (payload: Record<string, any>) => {
  return await axios.post(
    'https://api.paystack.co/transaction/initialize',
    {
      email: payload.email,
      amount: payload.amount,
      metadata: payload.metadata,
      callback_url: `${config.ORIGIN_URL}/payments/verify`,
    },
    {
      headers: {
        Authorization: `Bearer ${config.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  )
}

const verifyPayment = async (reference: string) => {
  return await axios.get(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${config.PAYSTACK_SECRET_KEY}`,
      },
    }
  )
}

const createPayment = async (payload: Payment): Promise<Payment> => {
  return await prisma.payment.create({
    data: payload,
  })
}

export default {
  findPaymentById,
  initializePayment,
  verifyPayment,
  createPayment,
}

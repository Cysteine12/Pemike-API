import axios from 'axios'
import prisma from '../config/prisma'
import { Payment, Prisma } from '@prisma/client'
import { config } from '../config/config'

export interface PaymentPayload {
  email: string
  amount: number
  metadata: Record<string, any>
  expiry: number
}
export interface PaystackCustomer {
  email: string
  [key: string]: any
}
export interface PaystackData {
  reference: string
  amount: number
  channel: string
  status: string
  customer: PaystackCustomer
  [key: string]: any
}
export interface PaystackWebhookEvent {
  event: string
  data: PaystackData
}
export type PaymentFindManyArgs = Prisma.PaymentFindManyArgs
export type PaymentFindUniqueArgs = Prisma.PaymentFindUniqueArgs
export type PaymentWhereInput = Prisma.PaymentWhereInput
export type PaymentWhereUniqueInput = Prisma.PaymentWhereUniqueInput
export type PaymentCreateInput = Prisma.PaymentCreateInput

const findPayments = async (
  filter: PaymentWhereInput,
  options?: PaymentFindManyArgs & {
    page?: number
    limit?: number
  }
): Promise<Payment[]> => {
  if (options?.page && options?.limit) {
    options.skip = (options?.page - 1) * options?.limit
  }

  return await prisma.payment.findMany({
    where: filter,
    skip: options?.skip || 0,
    take: options?.limit || 20,
    include: { booking: true },
  })
}

const findPayment = async (
  filter: PaymentWhereUniqueInput,
  options?: PaymentFindUniqueArgs
): Promise<Payment | null> => {
  return await prisma.payment.findUnique({
    where: filter,
    include: { booking: true },
  })
}

const initializePayment = async (payload: PaymentPayload) => {
  console.log(payload)

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

const createPayment = async (payload: PaymentCreateInput): Promise<Payment> => {
  return await prisma.payment.create({
    data: payload,
  })
}

export default {
  findPayments,
  findPayment,
  initializePayment,
  verifyPayment,
  createPayment,
}

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
import prisma from '../config/prisma';
const findPaymentById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.payment.findUnique({
        where: { id },
        include: { booking: true },
    });
});
const initializePayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield axios.post('https://api.paystack.co/transaction/initialize', {
        email: payload.email,
        amount: payload.amount,
        metadata: payload.metadata,
        callback_url: `${process.env.ORIGIN_URL}/payments/verify`,
    }, {
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
        },
    });
});
const verifyPayment = (reference) => __awaiter(void 0, void 0, void 0, function* () {
    return yield axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
    });
});
const createPayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.payment.create({
        data: payload,
    });
});
export default {
    findPaymentById,
    initializePayment,
    verifyPayment,
    createPayment,
};

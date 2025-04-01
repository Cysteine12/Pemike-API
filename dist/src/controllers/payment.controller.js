var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { emailService, paymentService } from '../services';
import catchAsync from '../utils/catchAsync';
import { NotFoundError, PaymentAPIError } from '../middlewares/errorHandler';
const getPayment = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const payment = yield paymentService.findPaymentById(id);
    if (!payment) {
        throw new NotFoundError('Payment not found');
    }
    res.status(200).json({
        success: true,
        data: payment,
    });
}));
const initializePayment = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = {
        email: req.body.email,
        amount: req.body.amount * 100,
        metadata: {
            bookingId: req.body.bookingId,
        },
    };
    const response = yield paymentService.initializePayment(payload);
    if (!response)
        throw new PaymentAPIError('Payment attempt failed');
    res.status(200).json({
        success: true,
        data: response.data.data.authorization_url,
    });
}));
const verifyPayment = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reference } = req.params;
    const response = yield paymentService.verifyPayment(reference);
    if (response.data.data.status !== 'success') {
        throw new PaymentAPIError(`Payment verification ${response.data.data.status}`);
    }
    if (!response.data.data.metadata.bookingId) {
        throw new PaymentAPIError(`Invalid payment reference`);
    }
    const newPayment = {
        amount: response.data.data.amount / 100,
        reference: response.data.data.reference,
        method: response.data.data.channel,
        status: response.data.data.status.toUpperCase(),
        booking: { connect: { id: response.data.data.metadata.bookingId } },
    };
    const savedPayment = yield paymentService.createPayment(newPayment);
    yield emailService.sendPaymentVerificationMail(response.data.data.customer.email, savedPayment);
    res.status(200).json({
        success: true,
        data: savedPayment,
        message: 'Payment verification successful',
    });
}));
export default {
    getPayment,
    initializePayment,
    verifyPayment,
};

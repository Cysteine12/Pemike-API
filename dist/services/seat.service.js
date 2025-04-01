var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import prisma from '../config/prisma';
import select from '../utils/select';
const findSeatsByTrip = (filter, options) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.seat.findMany({
        where: filter,
        select: select(options.select),
    });
});
const createSeat = (filter, payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.seat.upsert({
        where: { seatNo_tripId: filter },
        update: payload,
        create: payload,
    });
});
export default {
    findSeatsByTrip,
    createSeat,
};

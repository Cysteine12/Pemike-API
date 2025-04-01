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
const findTrips = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 20 } = options;
    return yield prisma.trip.findMany({
        skip: (page - 1) * limit || 0,
        take: limit || undefined,
        include: { vehicle: true },
    });
});
const searchTrips = (filter, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 20 } = options;
    return yield prisma.trip.findMany({
        where: {
            AND: [{ source: filter.source }, { destination: filter.destination }],
        },
        skip: (page - 1) * limit || 0,
        take: limit || undefined,
        include: { vehicle: true },
    });
});
const findTripById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.trip.findUnique({
        where: { id },
        include: { vehicle: true },
    });
});
const createTrip = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.trip.create({
        data: payload,
    });
});
export default {
    findTrips,
    searchTrips,
    findTripById,
    createTrip,
};

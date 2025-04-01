var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import prisma from '../../src/config/prisma';
import logger from '../../src/middlewares/logger';
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.seat.createMany({
        data: [
            {
                seatNo: 4,
                status: 'BOOKED',
                tripId: '2fd543c9-209b-46fb-90cb-7e21bd83006e',
            },
            {
                seatNo: 7,
                status: 'BOOKED',
                tripId: '2fd543c9-209b-46fb-90cb-7e21bd83006e',
            },
        ],
    });
});
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    logger.info('Seat table seeded successfully!');
    yield prisma.$disconnect();
    process.exit(1);
}))
    .catch((err) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(err);
    logger.error(err);
    yield prisma.$disconnect();
}));

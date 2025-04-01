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
    yield prisma.vehicle.createMany({
        data: [
            {
                category: 'BUS',
                brand: 'Toyota',
                model: 'Hiace',
                licenseNo: 'FM246ABJ',
                totalPassengerSeat: 14,
                thumbnail: 'https://res.cloudinary.com/dbjghnlke/image/upload/v1739551140/mega-automotives/app/rentals/eeowf5iokm0l3igqaqyw.webp',
            },
            {
                category: 'CAR',
                brand: 'Nissan',
                model: 'Camry',
                licenseNo: 'LK276AGG',
                totalPassengerSeat: 5,
                thumbnail: 'https://res.cloudinary.com/dbjghnlke/image/upload/v1739551140/mega-automotives/app/rentals/eeowf5iokm0l3igqaqyw.webp',
            },
        ],
    });
});
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    logger.info('Vehicle table seeded successfully!');
    yield prisma.$disconnect();
    process.exit(1);
}))
    .catch((err) => __awaiter(void 0, void 0, void 0, function* () {
    logger.error(err);
    yield prisma.$disconnect();
}));

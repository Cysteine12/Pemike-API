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
    yield prisma.trip.createMany({
        data: [
            {
                fare: 15000,
                source: 'Osogbo Garage',
                destination: 'Agege Bus stop',
                departureSchedule: '2025-03-10T02:07:58.706Z',
                driverId: 'b5e98c41-de36-4e20-a0cc-c3f38677dd9c',
                vehicleId: '08b538b5-57bf-48a9-a1a6-4391e224d2d8',
            },
            {
                fare: 7000,
                source: 'New Trade Park',
                destination: 'Onitsha Bus stop',
                departureSchedule: '2025-03-17T02:07:58.706Z',
                driverId: 'b5e98c41-de36-4e20-a0cc-c3f38677dd9c',
                vehicleId: '0bf32e28-4d9e-4ddc-854e-d18f5b0f43bb',
            },
            {
                fare: 8500,
                source: 'Ilesha Garage, Osun',
                destination: 'Owo, Ondo',
                departureSchedule: '2025-04-02T02:07:58.706Z',
                driverId: 'b5e98c41-de36-4e20-a0cc-c3f38677dd9c',
                vehicleId: '08b538b5-57bf-48a9-a1a6-4391e224d2d8',
            },
            {
                fare: 7700,
                source: 'New Trade Park, Iwo Road',
                destination: 'Challenge Bus stop, Ibadan, Oyo',
                departureSchedule: '2025-04-17T02:07:58.706Z',
                driverId: 'b5e98c41-de36-4e20-a0cc-c3f38677dd9c',
                vehicleId: '0bf32e28-4d9e-4ddc-854e-d18f5b0f43bb',
            },
            {
                fare: 12000,
                source: 'Iyanapaja Brigde, Lagos',
                destination: 'Ado-Ekiti',
                departureSchedule: '2025-03-19T02:07:58.706Z',
                driverId: 'b5e98c41-de36-4e20-a0cc-c3f38677dd9c',
                vehicleId: '08b538b5-57bf-48a9-a1a6-4391e224d2d8',
            },
            {
                fare: 7000,
                source: 'Abu Park, Zaria, Kaduna',
                destination: 'Ikeja, Lagos',
                departureSchedule: '2025-04-07T02:07:58.706Z',
                driverId: 'b5e98c41-de36-4e20-a0cc-c3f38677dd9c',
                vehicleId: '08b538b5-57bf-48a9-a1a6-4391e224d2d8',
            },
        ],
    });
});
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    logger.info('Trip table seeded successfully!');
    yield prisma.$disconnect();
    process.exit(1);
}))
    .catch((err) => __awaiter(void 0, void 0, void 0, function* () {
    logger.error(err);
    yield prisma.$disconnect();
}));

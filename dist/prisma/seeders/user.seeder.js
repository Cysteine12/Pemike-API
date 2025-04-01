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
    yield prisma.user.createMany({
        data: [
            {
                email: 'gbengabp12@gmail.com',
                firstName: 'Gbenga',
                lastName: 'Balogun',
                password: 'test1234',
                gender: 'MALE',
                phone: '07064556534',
                isVerified: true,
            },
            {
                email: 'test@gmail.com',
                firstName: 'test',
                lastName: 'test',
                password: 'test1234',
                gender: 'FEMALE',
                phone: '07064556534',
                isVerified: true,
            },
            {
                email: 'admin@gmail.com',
                firstName: 'Admin',
                lastName: 'Main',
                password: 'test1234',
                gender: 'MALE',
                phone: '07064556534',
                isVerified: true,
            },
            {
                email: 'driver@gmail.com',
                firstName: 'Musa',
                lastName: 'Salahu',
                password: 'test1234',
                gender: 'MALE',
                role: 'DRIVER',
                phone: '07064556534',
                isVerified: true,
            },
        ],
    });
});
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    logger.info('User table seeded successfully!');
    yield prisma.$disconnect();
    process.exit(1);
}))
    .catch((err) => __awaiter(void 0, void 0, void 0, function* () {
    logger.error(err);
    yield prisma.$disconnect();
}));

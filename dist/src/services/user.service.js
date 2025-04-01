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
const findUser = (filter, options) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.user.findUnique({
        where: filter,
        select: select(options === null || options === void 0 ? void 0 : options.select),
    });
});
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.user.create({
        data: payload,
    });
});
const createOrUpdateUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.user.upsert({
        where: { email: payload.email },
        update: payload,
        create: payload,
    });
});
const updateUser = (filter, payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.user.update({
        where: filter,
        data: payload,
    });
});
export default {
    findUser,
    createUser,
    createOrUpdateUser,
    updateUser,
};

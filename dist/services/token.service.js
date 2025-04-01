var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { TokenType } from '@prisma/client';
import prisma from '../config/prisma';
const generateToken = (payload, secret) => {
    return jwt.sign(payload, secret);
};
const generateAndSaveAuthTokens = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const accessTokenExpires = Date.now() + config.jwt.ACCESS_TOKEN_EXPIRATION_HOURS * 60 * 60 * 1000;
    const refreshTokenExpires = Date.now() + config.jwt.REFRESH_TOKEN_EXPIRATION_HOURS * 60 * 60 * 1000;
    const accessToken = generateToken({
        sub: userId,
        exp: accessTokenExpires,
        type: TokenType.ACCESS,
    }, config.jwt.ACCESS_TOKEN_SECRET);
    const refreshToken = generateToken({
        sub: userId,
        exp: refreshTokenExpires,
        type: TokenType.REFRESH,
    }, config.jwt.REFRESH_TOKEN_SECRET);
    yield createToken({
        token: refreshToken,
        user: { connect: { id: userId } },
        expires: refreshTokenExpires,
        type: TokenType.REFRESH,
    });
    return {
        access: { token: accessToken, expires: accessTokenExpires },
        refresh: { token: refreshToken, expires: refreshTokenExpires },
    };
});
const generateAndSaveVerifyEmailToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const verifyTokenExpires = Date.now() + config.jwt.VERIFY_EMAIL_EXPIRATION_HOURS * 60 * 60 * 1000;
    const verifyEmailToken = generateToken({
        sub: userId,
        exp: verifyTokenExpires,
        type: TokenType.VERIFY_EMAIL,
    }, config.jwt.JWT_SECRET);
    yield createToken({
        token: verifyEmailToken,
        user: { connect: { id: userId } },
        expires: verifyTokenExpires,
        type: TokenType.REFRESH,
    });
    return verifyEmailToken;
});
const createToken = (newToken) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.token.create({
        data: newToken,
    });
});
export default {
    generateToken,
    generateAndSaveAuthTokens,
    generateAndSaveVerifyEmailToken,
    createToken,
};

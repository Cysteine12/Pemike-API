var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CacheAPIError, NotFoundError, UnauthenticatedError, UnauthorizedError, ValidationError, } from '../middlewares/errorHandler';
import { authService, emailService, tokenService, userService, } from '../services';
import catchAsync from '../utils/catchAsync';
import bcrypt from 'bcryptjs';
import pick from '../utils/pick';
import exclude from '../utils/exclude';
import cache from '../config/cache';
import { config } from '../config/config';
import { cookieConfig } from '../utils/cookieConfig';
const register = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let newUser = pick(req.body, [
        'firstName',
        'lastName',
        'email',
        'phone',
        'gender',
        'password',
    ]);
    const user = yield userService.findUser({ email: newUser.email });
    if (user) {
        throw new ValidationError('This email already exists');
    }
    const salt = yield bcrypt.genSalt(10);
    newUser.password = yield bcrypt.hash(newUser.password, salt);
    yield userService.createUser(newUser);
    res.status(201).json({
        success: true,
        message: 'Registration successful. Please check your email to verify your account.',
    });
}));
const login = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    let user = yield authService.findUser({ email: email });
    if (!user) {
        throw new NotFoundError('Invalid credentials');
    }
    if (!user.password) {
        res.status(200).json({ success: false, type: 'add-password' });
        return;
    }
    const isMatch = yield bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new ValidationError('Invalid credentials');
    }
    if (!user.isVerified) {
        const verificationToken = yield tokenService.generateAndSaveVerifyEmailToken(user.id);
        const verifyUrl = `${process.env.ORIGIN_URL}/verify-email/${verificationToken}`;
        yield emailService.sendUserVerificationOTP(user, verifyUrl);
    }
    const { access, refresh } = yield tokenService.generateAndSaveAuthTokens(user.id);
    res.cookie('accessToken', access.token, cookieConfig(access.expires));
    res.cookie('refreshToken', refresh.token, cookieConfig(refresh.expires));
    let filteredUser = exclude(user, ['password', 'createdAt', 'updatedAt']);
    res.status(200).json({
        success: true,
        message: 'Login successful',
        user: filteredUser,
    });
}));
const refreshToken = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new UnauthenticatedError('No refresh token');
    }
    // const { access, refresh } = await tokenService.generateAndSaveAuthTokens(
    //   user.id
    // )
    // res.cookie('accessToken', access.token, cookieConfig(access.expires))
    // res.cookie('refreshToken', refresh.token, cookieConfig(refresh.expires))
    res.status(200).json({
        success: true,
        message: 'Tokens refreshed successfully',
    });
}));
const addPassword = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let newUser = pick(req.body, ['email', 'password']);
    const user = yield userService.findUser({ email: newUser.email });
    if (user) {
        throw new ValidationError('This email already exists');
    }
    const salt = yield bcrypt.genSalt(10);
    newUser.password = yield bcrypt.hash(newUser.password, salt);
    yield userService.createUser(newUser);
    res.status(201).json({
        success: true,
        message: 'Registration successful. Please check your email to verify your account.',
    });
}));
const requestOTP = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const cachedOTP = cache.set(email, otp, config.OTP_EXPIRATION_MINUTES * 60);
    if (!cachedOTP)
        throw new CacheAPIError('An Error Ocurred');
    yield emailService.sendUserVerificationOTP(email, otp);
    res.status(201).json({
        success: true,
    });
}));
const verifyOTP = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    const cachedOTP = cache.take(email);
    if (!cachedOTP)
        throw new NotFoundError('Expired OTP, Try Again!');
    if (cachedOTP !== String(otp)) {
        throw new UnauthorizedError('Wrong code, Try Again!');
    }
    res.status(201).json({
        success: true,
    });
}));
const logout = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({
        success: true,
        message: 'Logout successful',
    });
}));
export default {
    register,
    login,
    refreshToken,
    requestOTP,
    verifyOTP,
    logout,
};

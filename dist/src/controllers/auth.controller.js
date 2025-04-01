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
import jwt from 'jsonwebtoken';
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
    const savedUser = yield userService.createUser(newUser);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const isCached = cache.set(newUser.email, otp, config.jwt.VERIFY_EMAIL_EXPIRATION_HOURS * 60 * 60);
    if (!isCached)
        throw new CacheAPIError('An Error Ocurred');
    yield emailService.sendEmailVerificationRequestMail(savedUser, otp);
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
        throw new ValidationError('passwordless-login');
    }
    const isMatch = yield bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new ValidationError('Invalid credentials');
    }
    if (!user.isVerified) {
        throw new ValidationError('verify-email');
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
const passwordlessLogin = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    const cachedOTP = cache.take(email);
    if (!cachedOTP)
        throw new NotFoundError('Expired OTP, Try Again!');
    if (cachedOTP !== String(otp)) {
        throw new UnauthorizedError('Wrong code, Try Again!');
    }
    let user = yield authService.findUser({ email: email });
    if (!user)
        throw new NotFoundError('User not found');
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
const verifyEmail = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.params;
    const cachedOTP = cache.take(email);
    if (!cachedOTP)
        throw new NotFoundError('Expired OTP, Try Again!');
    if (cachedOTP !== String(otp)) {
        throw new UnauthorizedError('Wrong code, Try Again!');
    }
    const updatedUser = yield userService.updateUser({ email }, { isVerified: true });
    yield emailService.sendWelcomeMail(updatedUser.email, updatedUser.firstName);
    res.status(200).json({
        success: true,
        message: 'Email verification successful',
        user: updatedUser,
    });
}));
const setPassword = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newPassword = req.body.password;
    const { id } = req.user;
    let user = yield userService.findUser({ id });
    if (!user || user.password) {
        throw new ValidationError('User not found');
    }
    const salt = yield bcrypt.genSalt(10);
    user.password = yield bcrypt.hash(newPassword, salt);
    yield userService.updateUser({ id }, user);
    res.status(201).json({
        success: true,
        message: 'Password added successfully',
    });
}));
const changePassword = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentPassword, newPassword } = req.body;
    const { id } = req.user;
    let user = yield authService.findUser({ id });
    if (!user || !user.password) {
        throw new NotFoundError('User not found');
    }
    const isMatch = yield bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        throw new ValidationError('Incorrect password');
    }
    const salt = yield bcrypt.genSalt(10);
    user.password = yield bcrypt.hash(newPassword, salt);
    yield userService.updateUser({ id }, user);
    yield emailService.sendPasswordChangedMail(user);
    res.status(200).json({
        success: true,
        message: 'Password has been changed successfully',
    });
}));
const refreshToken = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new UnauthenticatedError('No refresh token');
    }
    jwt.verify(refreshToken, config.jwt.REFRESH_TOKEN_SECRET, (err, payload) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            throw new UnauthenticatedError('Invalid or expired token');
        const { access, refresh } = yield tokenService.generateAndSaveAuthTokens(payload.sub);
        res.cookie('accessToken', access.token, cookieConfig(access.expires));
        res.cookie('refreshToken', refresh.token, cookieConfig(refresh.expires));
        res.status(200).json({
            success: true,
            message: 'Tokens refreshed successfully',
        });
    }));
    res.status(200).json({
        success: true,
        message: 'Tokens refreshed successfully',
    });
}));
const requestOTP = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, type = 'general' } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const isCached = cache.set(email, otp, config.OTP_EXPIRATION_MINUTES * 60);
    if (!isCached)
        throw new CacheAPIError('An Error Ocurred');
    yield emailService.sendUserVerificationOTP(email, otp);
    res.status(201).json({
        success: true,
    });
}));
const verifyOTP = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp, type } = req.body;
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
    passwordlessLogin,
    verifyEmail,
    setPassword,
    changePassword,
    refreshToken,
    requestOTP,
    verifyOTP,
    logout,
};

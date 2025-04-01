var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { tokenService, userService } from '../services';
import catchAsync from '../utils/catchAsync';
import { cookieConfig } from '../utils/cookieConfig';
import exclude from '../utils/exclude';
import pick from '../utils/pick';
const getProfile = catchAsync((req, res) => {
    let user = req.user;
    const filteredUser = exclude(user, ['password', 'createdAt', 'updatedAt']);
    res.status(200).json({
        success: true,
        user: filteredUser,
    });
});
const createProfile = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = pick(req.body, [
        'firstName',
        'lastName',
        'email',
        'phone',
        'gender',
    ]);
    const savedUser = yield userService.createOrUpdateUser(newUser);
    const { access, refresh } = yield tokenService.generateAndSaveAuthTokens(savedUser.id);
    res.cookie('accessToken', access.token, cookieConfig(access.expires));
    res.cookie('refreshToken', refresh.token, cookieConfig(refresh.expires));
    const user = exclude(savedUser, ['password', 'createdAt', 'updatedAt']);
    res.status(200).json({
        success: true,
        message: 'Profile created successfully',
        user: user,
    });
}));
export default {
    getProfile,
    createProfile,
};

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Strategy as JwtStrategy } from 'passport-jwt';
import { config } from './config';
import { userService } from '../services';
export default () => {
    const cookieExtractor = (req) => {
        let token;
        if (req && req.cookies) {
            token = req.cookies.accessToken;
        }
        return token;
    };
    return new JwtStrategy({
        jwtFromRequest: cookieExtractor,
        secretOrKey: config.jwt.ACCESS_TOKEN_SECRET,
    }, (payload, done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield userService.findUser({ id: payload.sub });
            if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        }
        catch (err) {
            return done(err, false);
        }
    }));
};

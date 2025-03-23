import { Request } from 'express'
import { Strategy as JwtStrategy } from 'passport-jwt'
import { PassportStatic } from 'passport'
import prisma from './prisma'

export default (passport: PassportStatic) => {
    const cookieExtractor = (req: Request) => {
        let token
        if (req && req.cookies) {
            token = req.cookies.accessToken
        }
        return token
    }

    passport.use(
        new JwtStrategy(
            {
                jwtFromRequest: cookieExtractor,
                secretOrKey: process.env.ACCESS_TOKEN_SECRET,
            },
            async (payload, done) => {
                try {
                    const user = await prisma.user.find({ id: payload.id })

                    if (user) {
                        return done(null, user)
                    } else {
                        return done(null, false)
                    }
                } catch (err) {
                    return done(err, false)
                }
            }
        )
    )
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser(async (id, done) => {
        try {
            let user = await prisma.user.find(id)
            return done(null, user)
        } catch (err) {
            return done(err, null)
        }
    })
}

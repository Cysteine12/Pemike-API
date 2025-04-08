import { Request } from 'express'
import { Strategy as JwtStrategy } from 'passport-jwt'
import { config } from './config'
import { userService } from '../services'

export default () => {
  const cookieExtractor = (req: Request) => {
    let token
    if (req && req.cookies) {
      token = req.cookies.accessToken
    }
    return token
  }

  return new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: config.jwt.ACCESS_TOKEN_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await userService.findUser({
          id: payload.sub,
          role: payload.role,
        })

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
}

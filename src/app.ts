import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import logger from './middlewares/logger'
import { rateLimit } from 'express-rate-limit'
import { config } from './config/config'
import passport from 'passport'
import passportJwt from './config/passport-jwt'

const app = express()

//=======Middlewares======//
if (config.NODE_ENV !== 'production') {
  app.use(
    morgan('dev', {
      stream: { write: (message) => logger.info(message.trim()) },
    })
  )
}

app.use(
  cors({
    origin: config.ORIGIN_URL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders:
      'Accept, Accept-Language, X-Requested-With, Content-Language, Content-Type, Origin, Authorization',
    optionsSuccessStatus: 200,
    credentials: true,
  })
)

app.use(helmet())
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
  })
)

app.use(cookieParser())
app.use(
  express.json({
    verify: (req: IncomingMessage & { rawBody: any }, res, buf) => {
      req.rawBody = buf
    },
  })
)
app.use(express.urlencoded({ extended: false }))

passport.use('jwt', passportJwt())
app.use(passport.initialize())

//=======Routes========//
import routes from './routes'
app.use('/api', routes)

//=======Error Handler=======//
import { notFoundHandler, errorHandler } from './middlewares/errorHandler'
import { IncomingMessage } from 'http'
app.use(notFoundHandler)
app.use(errorHandler)

//=======........========//
const PORT = config.PORT

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

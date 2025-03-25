import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import logger from './middlewares/logger'
import { rateLimit } from 'express-rate-limit'

const app = express()

//=======Middlewares======//
if (process.env.NODE_ENV !== 'production') {
  app.use(
    morgan('dev', {
      stream: { write: (message) => logger.info(message.trim()) },
    })
  )
}

app.use(
  cors({
    origin: process.env.ORIGIN_URL,
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
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//=======Routes========//
import routes from './routes'
app.use('/api', routes)

//=======Error Handler=======//
import { notFoundHandler, errorHandler } from './middlewares/errorHandler'
app.use(notFoundHandler)
app.use(errorHandler)

//=======........========//
const PORT = process.env.PORT

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

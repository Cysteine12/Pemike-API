import { User } from '@prisma/client'

declare module 'express-serve-static-core' {
  interface Request {
    user?: User
    rawBody?: string | Buffer
  }
}

import { NextFunction, Request, Response } from 'express'
import logger from './logger.js'
import { config } from '../config/config.js'

class ValidationError extends Error {
  statusCode: number

  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
    this.statusCode = 400
  }
}

class UnauthenticatedError extends Error {
  statusCode: number

  constructor(message: string) {
    super(message)
    this.name = 'UnauthenticatedError'
    this.statusCode = 401
  }
}

class UnauthorizedError extends Error {
  statusCode: number

  constructor(message: string) {
    super(message)
    this.name = 'UnauthorizedError'
    this.statusCode = 403
  }
}

class PaymentAPIError extends Error {
  statusCode: number

  constructor(message: string) {
    super(message)
    this.name = 'PaymentAPIError'
    this.statusCode = 403
  }
}

class CacheAPIError extends Error {
  statusCode: number

  constructor(message: string) {
    super(message)
    this.name = 'CacheAPIError'
    this.statusCode = 403
  }
}

class NotFoundError extends Error {
  statusCode: number

  constructor(message: string) {
    super(message)
    this.name = 'NotFoundError'
    this.statusCode = 404
  }
}

const notFoundHandler = () => {
  throw new NotFoundError('Route not found')
}

const errorHandler = (
  err: Error & { statusCode: number },
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { statusCode = 500, message } = err

  if (!err.statusCode || err.statusCode >= 500) {
    message = 'Internal Server Error'
    logger.error(`${err.message}, \n_Stack:_ ${err.stack}`)
  }

logger.error(`${err.message}, \n_Stack:_ ${err.stack}`)

  res.status(statusCode).json({
    success: false,
    message,
    error: config.NODE_ENV !== 'production' ? err.stack : undefined,
  })
}

export {
  NotFoundError,
  ValidationError,
  UnauthenticatedError,
  UnauthorizedError,
  PaymentAPIError,
  CacheAPIError,
  notFoundHandler,
  errorHandler,
}

import { NextFunction, Request, Response } from 'express'
import { ValidationError } from './errorHandler'
import { Schema } from 'zod'

const validate = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body)
      next()
    } catch (err: any) {
      throw new ValidationError(err.errors[0].message)
    }
  }
}

export { validate }

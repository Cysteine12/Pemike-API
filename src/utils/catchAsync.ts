import { RequestHandler } from 'express'
import { Request, Response, NextFunction } from 'express-serve-static-core'

export interface CustomParamsDictionary {
  [key: string]: any
}

export interface PaginationQuery {
  page?: string
  limit?: string
  source?: string
  destination?: string
  search?: string
}

const catchAsync =
  (
    callback: RequestHandler<
      CustomParamsDictionary,
      any,
      any,
      PaginationQuery,
      Record<string, any>
    >
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(callback(req, res, next)).catch((err) => next(err))
  }

export default catchAsync

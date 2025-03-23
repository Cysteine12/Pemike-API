import { RequestHandler } from 'express'
import { Request, Response, NextFunction } from 'express-serve-static-core'

export interface CustomParamsDictionary {
  [key: string]: any
}

const catchAsync =
  (
    callback: RequestHandler<
      CustomParamsDictionary,
      any,
      any,
      qs.ParsedQs,
      Record<string, any>
    >
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(callback(req, res, next)).catch((err) => next(err))
  }

export default catchAsync

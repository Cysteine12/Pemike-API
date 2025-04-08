import { NextFunction, Request, Response } from 'express'
import { UnauthenticatedError, UnauthorizedError } from './errorHandler.js'
import { UserRole } from '@prisma/client'

const authorize = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      throw new UnauthenticatedError('You need to login first')
    }

    const userRole = req.user.role

    if (!roles.includes(userRole)) {
      throw new UnauthorizedError("You don't have the permission for access")
    }
    next()
  }
}

export { authorize }

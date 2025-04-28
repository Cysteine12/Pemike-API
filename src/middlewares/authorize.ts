import crypto from 'crypto'
import { NextFunction, Request, Response } from 'express'
import { UnauthenticatedError, UnauthorizedError } from './errorHandler.js'
import { UserRole } from '@prisma/client'
import { config } from '../config/config.js'

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

const authorizeWebhook = (req: Request, res: Response, next: NextFunction) => {
  console.info('Webhook triggered')

  const requestIP =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
    req.socket.remoteAddress
  
  if (!config.PAYSTACK_WEBHOOK_IPS.split(',').includes(requestIP)) {
    res.status(403).send('Forbidden')
  }

  const hash = crypto
    .createHmac('sha512', config.PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest('hex')

  if (hash !== req.headers['x-paystack-signature']) {
    res.status(403).send('Invalid signature')
  }

  next()
}

export { authorize, authorizeWebhook }

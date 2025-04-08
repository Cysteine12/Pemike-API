import jwt from 'jsonwebtoken'
import { AuthTokenResponse } from '../types/response'
import { config } from '../config/config'
import { Prisma, Token, TokenType, UserRole } from '@prisma/client'
import prisma from '../config/prisma'

type TokenCreateInput = Prisma.TokenCreateInput

const generateToken = (payload: object, secret: string, expiresIn: number) => {
  return jwt.sign(payload, secret, { expiresIn })
}

const generateAndSaveAuthTokens = async (
  userId: string,
  role: UserRole
): Promise<AuthTokenResponse> => {
  const accessTokenExpires =
    config.jwt.ACCESS_TOKEN_EXPIRATION_HOURS * 60 * 60 * 1000
  const refreshTokenExpires =
    config.jwt.REFRESH_TOKEN_EXPIRATION_HOURS * 60 * 60 * 1000

  const accessToken = generateToken(
    {
      sub: userId,
      role: role,
      type: TokenType.ACCESS,
    },
    config.jwt.ACCESS_TOKEN_SECRET,
    accessTokenExpires
  )

  const refreshToken = generateToken(
    {
      sub: userId,
      role: role,
      type: TokenType.REFRESH,
    },
    config.jwt.REFRESH_TOKEN_SECRET,
    refreshTokenExpires
  )

  await createToken({
    token: refreshToken,
    user: { connect: { id: userId } },
    expires: refreshTokenExpires,
    type: TokenType.REFRESH,
  })

  return {
    access: { token: accessToken, expires: accessTokenExpires },
    refresh: { token: refreshToken, expires: refreshTokenExpires },
  }
}

const createToken = async (
  newToken: TokenCreateInput
): Promise<Token | null> => {
  return await prisma.token.create({
    data: newToken,
  })
}

export default {
  generateToken,
  generateAndSaveAuthTokens,
  createToken,
}

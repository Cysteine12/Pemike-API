const env = (variable: string): any => {
  return process.env[variable]
}

const config = {
  NODE_ENV: env('NODE_ENV'),
  PORT: env('PORT'),
  ORIGIN_URL: env('ORIGIN_URL'),
  DATABASE_URL: env('DATABASE_URL'),
  OTP_EXPIRATION_MINUTES: env('OTP_EXPIRATION_MINUTES'),
  jwt: {
    JWT_SECRET: env('JWT_SECRET'),
    ACCESS_TOKEN_SECRET: env('ACCESS_TOKEN_SECRET'),
    REFRESH_TOKEN_SECRET: env('REFRESH_TOKEN_SECRET'),
    ACCESS_TOKEN_EXPIRATION_HOURS: env('JWT_ACCESS_TOKEN_EXPIRATION_HOURS'),
    REFRESH_TOKEN_EXPIRATION_HOURS: env('JWT_REFRESH_TOKEN_EXPIRATION_HOURS'),
    VERIFY_EMAIL_EXPIRATION_HOURS: env('JWT_VERIFY_EMAIL_EXPIRATION_HOURS'),
    RESET_PASSWORD_EXPIRATION_MINUTES: env(
      'JWT_RESET_PASSWORD_EXPIRATION_MINUTES'
    ),
  },
  email: {
    smtp: {
      HOST: env('SMTP_HOST'),
      PORT: env('SMTP_PORT'),
      auth: {
        USER: env('SMTP_USERNAME'),
        PASS: env('SMTP_PASSWORD'),
      },
    },
    FROM: env('EMAIL_FROM'),
  },
  PAYSTACK_SECRET_KEY: env('PAYSTACK_SECRET_KEY'),
}

export { config }

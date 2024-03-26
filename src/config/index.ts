import * as dotenv from 'dotenv'
dotenv.config()

export const ServiceEnv = {
  TAG: 'MODULE_LOGIN_API',
  AWS_TEST: process.env.AWS_TEST,
  DB_URL_CONNECT: process.env.DB_URL_CONNECT,
  DB_NAME: process.env.DB_NAME,
  NODE_ENV: process.env.NODE_ENV,
  SALT_ROUND: Number(process.env.SALT_ROUND),
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET
}

export * from './interfaces'
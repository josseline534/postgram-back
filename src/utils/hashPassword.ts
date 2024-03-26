import bcrypt from 'bcrypt'
import { Log } from './logger'
import { ServiceEnv } from '../config'

const log = new Log(`${ServiceEnv.TAG}::`)

const saltRounds = ServiceEnv.SALT_ROUND!

export const hashPassword = async (password: string): Promise<string> => {
  try {
    const salt = bcrypt.genSaltSync(saltRounds)
    const hashedPassword = bcrypt.hashSync(password, salt)
    return hashedPassword
  } catch (error) {
    log.error('.[hashPassword]', error)
    throw error
  }
}

export const comparePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  try {
    const match = bcrypt.compareSync(plainPassword, hashedPassword)
    return match
  } catch (error) {
    log.error('.[comparePassword]', error)
    throw error
  }
}

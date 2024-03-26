import { type NextFunction, type Request, type Response } from 'express'
import { HTTPErrors } from '../errors'
import { RevokeTokenRepository } from '../services/RevokeToken/revokeTokenRepository'
import { AuthenticateRepository } from '../services/Authenticate/authenticateRepository'
import { IUserModelResponse } from '../models/User/index'

export const authorizer = async (req: Request & { user?: IUserModelResponse }, _res: Response, next: NextFunction) => {
  try {
    const authToken = req.headers['pb-auth-token'] as string
    if (!authToken)
      throw HTTPErrors.unauthorized()

    const revokeTokenRepository = await RevokeTokenRepository.getInstance()
    const tokenRevokeFound = await revokeTokenRepository.findToken(authToken)
    if (tokenRevokeFound) throw HTTPErrors.unauthorized()

    const authenticateRepository = await AuthenticateRepository.getInstance()
    const userFound = await authenticateRepository.findToken(authToken)
    req.user = userFound
    next()
  } catch (error) {
    next(error)
  }
}
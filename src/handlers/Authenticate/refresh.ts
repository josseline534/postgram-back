import { NextFunction, Request, Response } from 'express'
import { Log } from '../../utils'
import { ServiceEnv } from '../../config'
import { HTTPErrors } from '../../errors'
import { AuthenticateRepository } from '../../services/Authenticate/authenticateRepository'

const log = new Log(`${ServiceEnv.TAG}:: .[CreateUser]`)

export const RefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authRefreshToken = req.headers['pb-refresh-token'] as string
    if (!authRefreshToken)
      throw HTTPErrors.unauthorized()

    const authenticateRepository = await AuthenticateRepository.getInstance()
    const { refreshToken, accessToken, idToken } = await authenticateRepository.refreshToken(
      authRefreshToken
    )
    res.cookie('refresh_token', refreshToken.token, { httpOnly: true })
    res.status(200).json({
      status: 200,
      data: {
        accessToken: accessToken.token,
        idToken: idToken.token
      }
    })
  } catch (error) {
    log.error(error)
    next(error)
  }
}
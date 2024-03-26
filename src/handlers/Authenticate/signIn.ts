import { NextFunction, Request, Response } from 'express'
import { Log } from '../../utils'
import { ServiceEnv } from '../../config'
import { HTTPErrors } from '../../errors'
import { decodedData } from '../../utils/base64'
import { AuthenticateRepository } from '../../services/Authenticate/authenticateRepository'

const log = new Log(`${ServiceEnv.TAG}:: .[CreateUser]`)

export const SignIn = async (req: Request, res: Response, next: NextFunction) => {
  const { headers } = req
  try {
    if (!headers.authorization || !headers.authorization.startsWith('Basic ')) throw HTTPErrors.badRequest()
    const [email, password] = decodedData(headers.authorization)
    const authenticateRepository = await AuthenticateRepository.getInstance()
    const { refreshToken, accessToken, idToken } = await authenticateRepository.createAuthenticate(
      {
        email, password
      }
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
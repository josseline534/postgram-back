import { NextFunction, Request, Response } from 'express'
import { Log } from '../../utils'
import { ServiceEnv } from '../../config'
import { AuthenticateRepository } from '../../services/Authenticate/authenticateRepository'

const log = new Log(`${ServiceEnv.TAG}:: .[CreateUser]`)

export const Logout = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.body
  try {
    const authenticateRepository = await AuthenticateRepository.getInstance()
    await authenticateRepository.logout(userId)
    res.status(200).json({
      status: 200
    })
  } catch (error) {
    log.error(error)
    next(error)
  }
}
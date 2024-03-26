import { NextFunction, Request, Response } from 'express'
import { UserRepository } from '../../services/User/userRepository'
import { Log } from '../../utils'
import { ServiceEnv } from '../../config'

const log = new Log(`${ServiceEnv.TAG}:: .[ByIdUser]`)

export const ByIdUser = async (req: Request, res: Response, next: NextFunction) => {
  const userId: string = req.params.userId
  try {
    const userRepository = await UserRepository.getInstance()
    const user = await userRepository.getUserById(userId)
    res.status(200).json({
      status: 200,
      data: user
    })
  } catch (error) {
    log.error(error)
    next(error)
  }
}
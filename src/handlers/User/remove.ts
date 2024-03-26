import { NextFunction, Request, Response } from 'express'
import { IUserModelResponse } from '../../models/User'
import { UserRepository } from '../../services/User/userRepository'
import { Log } from '../../utils'
import { ServiceEnv } from '../../config'

const log = new Log(`${ServiceEnv.TAG}:: .[UpdateUser]`)

export const RemoveUser = async (req: Request & { user?: IUserModelResponse }, res: Response, next: NextFunction) => {
  const userId: string = req.user!._id.toString()
  try {
    const userRepository = await UserRepository.getInstance()
    const user = await userRepository.removeUser(userId)
    res.status(200).json({
      status: 200,
      data: user
    })
  } catch (error) {
    log.error(error)
    next(error)
  }
}
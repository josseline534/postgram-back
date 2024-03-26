import { NextFunction, Request, Response } from 'express'
import { IUserModel, IUserModelResponse } from '../../models/User'
import { UserRepository } from '../../services/User/userRepository'
import { Log } from '../../utils'
import { ServiceEnv } from '../../config'
import { hashPassword } from '../../utils/hashPassword'

const log = new Log(`${ServiceEnv.TAG}:: .[UpdateUser]`)

export const UpdateUser = async (req: Request & { user?: IUserModelResponse }, res: Response, next: NextFunction) => {
  const userData: IUserModel = req.body
  const userId: string = req.user!._id.toString()
  try {
    const userRepository = await UserRepository.getInstance()
    if (userData.password) {
      const password = await hashPassword(userData.password)
      userData.password = password
    }
    const user = await userRepository.updateUser(userId, userData)
    res.status(200).json({
      status: 200,
      data: user
    })
  } catch (error) {
    log.error(error)
    next(error)
  }
}
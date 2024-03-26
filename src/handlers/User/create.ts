import { NextFunction, Request, Response } from 'express'
import { IUserModel } from '../../models/User'
import { UserRepository } from '../../services/User/userRepository'
import { Log } from '../../utils'
import { ServiceEnv } from '../../config'
import { hashPassword } from '../../utils/hashPassword'

const log = new Log(`${ServiceEnv.TAG}:: .[CreateUser]`)

export const CreateUser = async (req: Request, res: Response, next: NextFunction) => {
  const userData: IUserModel = req.body
  try {
    const userRepository = await UserRepository.getInstance()
    const password = await hashPassword(userData.password)
    const newUser = await userRepository.createUser({ ...userData, password })
    res.status(200).json({
      status: 200,
      data: newUser
    })
  } catch (error) {
    log.error(error)
    next(error)
  }
}
import { NextFunction, Request, Response } from 'express'
import { UserRepository } from '../../services/User/userRepository'
import { Log } from '../../utils'
import { ServiceEnv } from '../../config'
import { IQueryParams, SortOrderEnum } from '../../interfaces'
import { SortDirection } from 'mongodb'

const log = new Log(`${ServiceEnv.TAG}:: .[ListUser]`)

export const ListUser = async (
  req: Request & { query: IQueryParams },
  res: Response,
  next: NextFunction
) => {
  const {
    pageNumber = 1,
    pageSize = 10,
    sortOrder = SortOrderEnum.ASC
  } = req.query

  try {
    const userRepository = await UserRepository.getInstance()
    const users = await userRepository.getUsers({
      pageNumber: Number(pageNumber),
      pageSize: Number(pageSize),
      sortBy: { username: sortOrder as SortDirection }
    })
    res.status(200).json({
      status: 200,
      data: users
    })
  } catch (error) {
    log.error(error)
    next(error)
  }
}

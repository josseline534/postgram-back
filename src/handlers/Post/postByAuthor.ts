import { NextFunction, Request, Response } from 'express'
import { SortDirection } from 'mongodb'
import { Log } from '../../utils'
import { ServiceEnv } from '../../config'
import { PostRepository } from '../../services/Post/postRepository'
import { IQueryParams, SORT_ORDER_VALUES, SortOrderEnum } from '../../interfaces'

const log = new Log(`${ServiceEnv.TAG}:: .[ByIdPost]`)

export const ByAuthorPost = async (req: Request & { query: IQueryParams }, res: Response, next: NextFunction) => {
  const {
    pageNumber = 1,
    pageSize = 10,
    sortOrder = SortOrderEnum.ASC
  } = req.query
  const authorId: string = req.params.authorId
  try {
    const postRepository = await PostRepository.getInstance()
    const post = await postRepository.getPostByAuthor(authorId, {
      pageNumber: Number(pageNumber),
      pageSize: Number(pageSize),
      sortBy: { createdAt: SORT_ORDER_VALUES[sortOrder as SortOrderEnum] as SortDirection }
    })
    res.status(200).json({
      status: 200,
      data: post
    })
  } catch (error) {
    log.error(error)
    next(error)
  }
}
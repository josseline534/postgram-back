import { NextFunction, Request, Response } from 'express'
import { Log } from '../../utils'
import { ServiceEnv } from '../../config'
import { PostRepository } from '../../services/Post/postRepository'
import { IUserModelResponse } from '../../models/User'
import { HTTPErrors } from '../../errors'

const log = new Log(`${ServiceEnv.TAG}:: .[RemovePost]`)

export const RemovePost = async (req: Request & { user?: IUserModelResponse }, res: Response, next: NextFunction) => {
  const postId: string = req.params.postId
  const userId: string = req.user!._id.toString()
  try {
    const postRepository = await PostRepository.getInstance()
    const postFound = await postRepository.getPostOne(postId)
    if (postFound.author.toString() !== userId) throw HTTPErrors.forbidden({ entity: 'post' })
    const post = await postRepository.updatePost(postId, { isActive: false })
    res.status(200).json({
      status: 200,
      data: post
    })
  } catch (error) {
    log.error(error)
    next(error)
  }
}

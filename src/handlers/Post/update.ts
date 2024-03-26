import { NextFunction, Request, Response } from 'express'
import { Log } from '../../utils'
import { ServiceEnv } from '../../config'
import { PostRepository } from '../../services/Post/postRepository'
import { IPostModel } from '../../models/Post'

const log = new Log(`${ServiceEnv.TAG}:: .[UpdatePost]`)

export const UpdatePost = async (req: Request, res: Response, next: NextFunction) => {
  const postId: string = req.params.postId
  const postData: IPostModel = req.body
  try {
    const postRepository = await PostRepository.getInstance()
    const post = await postRepository.updatePost(postId, postData)
    res.status(200).json({
      status: 200,
      data: post
    })
  } catch (error) {
    log.error(error)
    next(error)
  }
}
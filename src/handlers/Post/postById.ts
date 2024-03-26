import { NextFunction, Request, Response } from 'express'
import { Log } from '../../utils'
import { ServiceEnv } from '../../config'
import { PostRepository } from '../../services/Post/postRepository'

const log = new Log(`${ServiceEnv.TAG}:: .[ByIdPost]`)

export const ByIdPost = async (req: Request, res: Response, next: NextFunction) => {
  const postId: string = req.params.postId
  try {
    const postRepository = await PostRepository.getInstance()
    const post = await postRepository.getPostById(postId)
    res.status(200).json({
      status: 200,
      data: post
    })
  } catch (error) {
    log.error(error)
    next(error)
  }
}
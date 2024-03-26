import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { Log } from '../../utils'
import { ServiceEnv } from '../../config'
import { IPostModel } from '../../models/Post'
import { PostRepository } from '../../services/Post/postRepository'
import { IUserModelResponse } from '../../models/User'

const log = new Log(`${ServiceEnv.TAG}:: .[CreatePost]`)

export const CreatePost = async (req: Request & { user?: IUserModelResponse }, res: Response, next: NextFunction) => {
  const postData: IPostModel = req.body
  const userId: string = req.user!._id.toString()
  try {
    const postRepository = await PostRepository.getInstance()
    const newPost = await postRepository.createPost({ ...postData, cantLikes: 0, author: new ObjectId(userId) })

    res.status(200).json({
      status: 200,
      data: newPost
    })
  } catch (error) {
    log.error(error)
    next(error)
  }
}
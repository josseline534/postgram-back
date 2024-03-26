import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { ServiceEnv } from '../../config'
import { PostRepository } from '../../services/Post/postRepository'
import { ActionPostEnum, IActionPost } from './interface'
import { IUserModelResponse } from '../../models/User'
import { Log } from '../../utils'
import { IPostModelResponse } from '../../models/Post'

const log = new Log(`${ServiceEnv.TAG}:: .[ActionPost]`)

export const ActionPost = async (req: Request & { user?: IUserModelResponse }, res: Response, next: NextFunction) => {
  const postId: string = req.params.postId
  const userId: string = req.user!._id.toString()
  const data: IActionPost = req.body
  try {
    const postRepository = await PostRepository.getInstance()
    const postFound = await postRepository.getPostOne(postId)

    const updatedFiles = getUpdatedFiles(data.action, postFound, userId)

    const post = await postRepository.updatePost(postId, updatedFiles)
    res.status(200).json({
      status: 200,
      data: post
    })
  } catch (error) {
    log.error(error)
    next(error)
  }
}

const getUpdatedFiles = (action: ActionPostEnum, post: IPostModelResponse, userId: string) => {
  const updatedFiles = {
    cantLike: 0,
    usersLike: [new ObjectId(userId)]
  }
  switch (action) {
  case ActionPostEnum.LIKE:
    updatedFiles.cantLike = post.cantLikes + 1
    updatedFiles.usersLike = [...updatedFiles.usersLike, ...(post.usersLike ?? [])]
    break
  case ActionPostEnum.DISLIKE:
    updatedFiles.cantLike = post.cantLikes > 0 ? post.cantLikes - 1 : 0
    updatedFiles.usersLike = (post.usersLike ?? []).filter((ul) => ul !== new ObjectId(userId))
    break
  default:
    updatedFiles.cantLike = post.cantLikes
    updatedFiles.usersLike = post.usersLike ?? []
    break
  }
  return updatedFiles
}
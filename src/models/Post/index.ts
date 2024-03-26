import { ObjectId } from 'mongodb'

export interface IPostModel {
  title: string
  description: string
  author: ObjectId
  cantLikes: number
  usersLike?: ObjectId[]
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface IPostModelResponse extends IPostModel {
  _id: ObjectId
}

export interface IPostFInd {
  _id?: ObjectId
  title?: string
  description?: string
  author?: ObjectId
  cantLikes?: number
  usersLike?: ObjectId[]
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}
import { ObjectId } from 'mongodb'

export enum IUserStatusEnum {
  ON_LINE = 'onLine',
  OFF_LINE = 'offLine'
}
export interface IUserModel {
  username: string
  email: string
  password: string
  isActive?: boolean
  status?: IUserStatusEnum
}

export interface IUserModelResponse extends IUserModel {
  _id: ObjectId
}

export interface IUserFind {
  _id?: ObjectId
  username?: string
  email?: string
  isActive?: boolean
  status?: IUserStatusEnum
}
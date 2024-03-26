import { ObjectId } from 'mongodb'

export interface IRevokeTokenModel {
  _id?: ObjectId,
  token: string
}
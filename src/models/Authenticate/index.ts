import { ObjectId } from 'mongodb'

export interface IToken {
  token: string
  expirationTime: number // minutes
}
export interface IAuthenticateModel {
  userId: ObjectId
  accessToken: IToken
  refreshToken: IToken
  idToken: IToken
  createdAt: string
  updatedAt: string
}

export interface IAuthenticateModelResponse extends IAuthenticateModel {
  _id: ObjectId
}
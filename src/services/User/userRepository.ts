import { Collection, Db, ObjectId } from 'mongodb'
import {
  IUserFind,
  IUserModel,
  IUserModelResponse,
  IUserStatusEnum
} from '../../models/User'
import { getDataBase } from '../../dataBase/connection'
import { Log } from '../../utils'
import { HTTPErrors } from '../../errors'
import { IOptionsFind } from '../../interfaces'

const COLLECTION_NAME = 'users'
const BASE_LOG = '[UserRepository] ::'
const log = new Log(BASE_LOG)

export class UserRepository {
  private static instance: UserRepository | null = null
  private db: Db | null = null
  private collection: Collection<IUserModel> | null = null

  public static async getInstance(): Promise<UserRepository> {
    try {
      if (!UserRepository.instance) {
        UserRepository.instance = new UserRepository()
      }
      return UserRepository.instance
    } catch (error) {
      log.error('.[getInstance] :: ', error)
      throw error
    }
  }

  private async getCollection() {
    this.db = await getDataBase()
    this.collection = this.db!.collection<IUserModel>(COLLECTION_NAME)
  }

  public async createUser(
    userData: IUserModel
  ): Promise<Omit<IUserModelResponse, 'password'>> {
    log.info(`.[createUser] :: ${userData.email}`)
    try {
      await this.getCollection()
      const userExist = await this.collection!.findOne({
        email: userData.email,
        isActive: true
      })
      if (userExist) {
        throw HTTPErrors.badRequest({
          entity: `user: ${userData.email}`,
          message: 'user is active'
        })
      }
      const result = await this.collection!.insertOne({
        ...userData,
        isActive: true,
        status: IUserStatusEnum.OFF_LINE
      })
      return {
        _id: result.insertedId,
        email: userData.email,
        username: userData.username
      }
    } catch (error) {
      log.error('.[createUser] :: ', error)
      throw error
    }
  }

  public async getUsers(options: IOptionsFind): Promise<IUserModelResponse[]> {
    log.info('.[getUsers]')
    try {
      const skipDocuments = (options.pageNumber - 1) * options.pageSize
      await this.getCollection()
      const users = await this.collection!.find(
        { isActive: true },
        { projection: { password: 0 } }
      )
        .sort(options.sortBy)
        .skip(skipDocuments)
        .limit(options.pageSize)
        .toArray()
      return users
    } catch (error) {
      log.error('.[getUsers] :: ', error)
      throw error
    }
  }

  public async getUserById(userId: string): Promise<IUserModelResponse> {
    log.info(`.[getUserById] Searching for user with ID: ${userId}`)
    try {
      const user = await this.find({ _id: new ObjectId(userId) }, false)
      if (!user) throw HTTPErrors.notFound({ entity: `user: ${userId}` })
      return user
    } catch (error) {
      log.error('.[getUserById] Error:', error)
      throw error
    }
  }

  public async updateUser(
    userId: string,
    updatedFields: Partial<IUserModel>
  ): Promise<IUserModelResponse | null> {
    log.info(`.[updateUser] Updating user with ID: ${userId}`)
    try {
      await this.getCollection()
      return await this.update(userId, updatedFields)
    } catch (error) {
      log.error('.[updateUser] Error:', error)
      throw error
    }
  }

  public async removeUser(userId: string): Promise<IUserModelResponse> {
    log.info(`.[updateUser] Updating user with ID: ${userId}`)
    try {
      await this.getCollection()
      return await this.update(userId, {
        isActive: false,
        status: IUserStatusEnum.OFF_LINE
      })
    } catch (error) {
      log.error('.[updateUser] Error:', error)
      throw error
    }
  }

  public async update(
    userId: string,
    updatedFields: Partial<IUserModel>
  ): Promise<IUserModelResponse> {
    log.info(`.[update] Updating user with ID: ${userId}`)
    try {
      await this.getCollection()
      const filter = { _id: new ObjectId(userId) }
      const update = { $set: updatedFields }
      const options = {
        returnOriginal: false,
        includeResultMetadata: false,
        projection: { password: 0 }
      }
      const result = await this.collection!.findOneAndUpdate(
        filter,
        update,
        options
      )

      if (!result) throw HTTPErrors.notFound({ entity: `user: ${userId}` })

      delete updatedFields.password
      return { ...result, ...updatedFields }
    } catch (error) {
      log.error('.[update] Error:', error)
      throw error
    }
  }

  public async find(
    userData: IUserFind,
    showPassword: boolean
  ): Promise<IUserModelResponse> {
    try {
      await this.getCollection()
      const user = await this.collection!.findOne(
        { ...userData, isActive: true },
        { projection: { password: showPassword } }
      )
      if (!user) throw HTTPErrors.notFound({ entity: 'user' })
      return user
    } catch (error) {
      log.error('.[find] Error:', error)
      throw error
    }
  }
}

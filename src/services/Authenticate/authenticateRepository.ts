import { Collection, Db, ObjectId } from 'mongodb'
import jwt from 'jsonwebtoken'
import dayjs from 'dayjs'
import { Log } from '../../utils'
import { IAuthenticateModel } from '../../models/Authenticate'
import { getDataBase } from '../../dataBase/connection'
import { IAuthenticate, IDataDecode } from './interfaces'
import { UserRepository } from '../User/userRepository'
import { HTTPErrors } from '../../errors'
import { comparePassword } from '../../utils/hashPassword'
import { IUserModelResponse, IUserStatusEnum } from '../../models/User'
import { ServiceEnv } from '../../config'
import { RevokeTokenRepository } from '../RevokeToken/revokeTokenRepository'
import { ITokenRevoke } from '../RevokeToken/interfaces'

const COLLECTION_NAME = 'authenticate'
const BASE_LOG = '[AuthenticateRepository] ::'
const log = new Log(BASE_LOG)
export class AuthenticateRepository {
  private static instance: AuthenticateRepository | null = null
  private db: Db | null = null
  private collection: Collection<IAuthenticateModel> | null = null
  private userRepository: UserRepository | null = null
  private revokeTokenRepository: RevokeTokenRepository | null = null

  public static async getInstance(): Promise<AuthenticateRepository> {
    try {
      if (!AuthenticateRepository.instance) {
        AuthenticateRepository.instance = new AuthenticateRepository()
        AuthenticateRepository.instance.userRepository =
          await UserRepository.getInstance()
        AuthenticateRepository.instance.revokeTokenRepository =
          await RevokeTokenRepository.getInstance()
      }
      return AuthenticateRepository.instance
    } catch (error) {
      log.error('.[getInstance] :: ', error)
      throw error
    }
  }

  private async getCollection() {
    this.db = await getDataBase()
    this.collection = this.db!.collection<IAuthenticateModel>(COLLECTION_NAME)
  }

  public async createAuthenticate(userData: IAuthenticate) {
    log.info(`.[createAuthenticate] :: ${userData.email}`)
    try {
      await this.getCollection()
      const userFound = await this.userRepository!.find(
        { email: userData.email },
        true
      )
      if (!userFound)
        throw HTTPErrors.notFound({ entity: `user: ${userData.email}` })

      const match = await comparePassword(userData.password, userFound.password)
      if (!match) throw HTTPErrors.badRequest({ entity: 'user or password' })

      const tokens = await this.upsertToken({
        email: userFound.email,
        username: userFound.username,
        _id: userFound._id.toString()
      }, dayjs().toISOString())

      await this.userRepository!.update(userFound._id.toString(), {
        status: IUserStatusEnum.ON_LINE
      })
      return tokens
    } catch (error) {
      log.error('.[createAuthenticate] :: ', error)
      throw error
    }
  }

  public async logout(userId: string) {
    try {
      await this.getCollection()
      await this.userRepository!.update(userId, {
        status: IUserStatusEnum.OFF_LINE
      })
      const tokens = await this.find(new ObjectId(userId))
      await this.revokeTokenRepository?.revokeToken(tokens)
    } catch (error) {
      log.error('.[logout] :: ', error)
      throw error
    }
  }

  public async findToken(token: string) {
    try {
      await this.getCollection()
      const tokenDecode = this.decodeToken(token)
      const authenticateFound = await this.collection!.findOne({ 'accessToken.token': token, userId: new ObjectId(tokenDecode._id) })
      if (!authenticateFound)
        throw HTTPErrors.unauthorized()

      const userFound = await this.userRepository?.find({ _id: authenticateFound.userId }, false)
      if (!userFound)
        throw HTTPErrors.unauthorized()

      return userFound
    } catch (error) {
      log.error('.[findToken] :: ', error)
      throw error
    }
  }

  public async refreshToken(token: string) {
    try {
      await this.getCollection()
      const tokenFound = await this.collection!.findOne({ 'refreshToken.token': token })
      if (!tokenFound) throw HTTPErrors.notFound({ entity: 'token' })

      const dateExpire = dayjs(tokenFound.updatedAt).add(1440, 'minutes').toISOString()

      if (dateExpire <= dayjs().toISOString()) {
        await this.logout(tokenFound!.userId.toString())
        throw HTTPErrors.forbidden()
      }

      const userFound = await this.userRepository!.find(
        { _id: tokenFound.userId },
        false
      )
      if (!userFound) {
        throw HTTPErrors.notFound({ entity: 'user' })
      }

      return await this.upsertToken({
        email: userFound.email,
        username: userFound.username,
        _id: userFound._id.toString()
      }, tokenFound.createdAt)

    } catch (error) {
      log.error('.[refreshToken] :: ', error)
      throw error
    }
  }
  private async find(userId: ObjectId) {
    try {
      const tokensFound = await this.collection!.find(
        { userId },
        {
          projection: {
            'accessToken.token': 1,
            'refreshToken.token': 1,
            'idToken.token': 1,
            _id: 0
          }
        }
      ).toArray()

      const tokens: ITokenRevoke[] = []
      for (const t of tokensFound) {
        tokens.push(
          { token: t.accessToken.token },
          { token: t.refreshToken.token },
          { token: t.idToken.token }
        )
      }

      return tokens
    } catch (error) {
      log.error('.[find] :: ', error)
      throw error
    }
  }

  private generateToken(payload: IDataDecode) {
    try {
      const accessToken = jwt.sign(payload, ServiceEnv.ACCESS_TOKEN_SECRET!, {
        expiresIn: '30m'
      })
      const refreshToken = jwt.sign(payload, ServiceEnv.REFRESH_TOKEN_SECRET!, {
        expiresIn: '1440m'
      })
      const idToken = jwt.sign(payload, ServiceEnv.ACCESS_TOKEN_SECRET!, {
        expiresIn: '60m'
      })
      return {
        accessToken: {
          token: accessToken,
          expirationTime: 15
        },
        refreshToken: {
          token: refreshToken,
          expirationTime: 1440
        },
        idToken: {
          token: idToken,
          expirationTime: 60
        }
      }
    } catch (error) {
      log.error('.[generateToken] :: ', error)
      throw error
    }
  }

  private decodeToken(token: string): IUserModelResponse {
    try {
      return jwt.verify(token, ServiceEnv.ACCESS_TOKEN_SECRET!) as IUserModelResponse
    } catch (error) {
      log.error('.[decodeToken] :: ', error)
      throw error
    }
  }

  private async upsertToken(userData: IDataDecode, createdAt: string) {
    try {
      await this.getCollection()
      const tokens = this.generateToken({
        email: userData.email,
        username: userData.username,
        _id: userData._id.toString()
      })

      const query = { userId: new ObjectId(userData._id) }
      const update = {
        $set: {
          ...tokens,
          createdAt,
          updatedAt: dayjs().toISOString()
        }
      }
      const options = { upsert: true }
      await this.collection!.updateOne(query, update, options)

      return tokens
    } catch (error) {
      log.error('.[upsertToken] :: ', error)
      throw error
    }
  }
}

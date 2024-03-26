import { Collection, Db } from 'mongodb'
import { IRevokeTokenModel } from '../../models/RevokeToken'
import { Log } from '../../utils'
import { getDataBase } from '../../dataBase/connection'
import { ITokenRevoke } from './interfaces'

const COLLECTION_NAME = 'revokeToken'
const BASE_LOG = '[RevokeTokenRepository] ::'
const log = new Log(BASE_LOG)
export class RevokeTokenRepository {
  private static instance: RevokeTokenRepository | null = null
  private db: Db | null = null
  private collection: Collection<IRevokeTokenModel> | null = null

  public static async getInstance(): Promise<RevokeTokenRepository> {
    try {
      if (!RevokeTokenRepository.instance) {
        RevokeTokenRepository.instance = new RevokeTokenRepository()
      }
      return RevokeTokenRepository.instance
    } catch (error) {
      log.error('.[getInstance] :: ', error)
      throw error
    }
  }

  private async getCollection() {
    this.db = await getDataBase()
    this.collection = this.db!.collection<IRevokeTokenModel>(COLLECTION_NAME)
  }
  public async revokeToken(tokens: ITokenRevoke[]) {
    try {
      await this.getCollection()
      await this.updateTokenPromises(tokens)
    } catch (error) {
      log.error('.[revokeToken] :: ', error)
      throw error
    }
  }

  public async findToken(token: string) {
    try {
      await this.getCollection()
      return await this.collection!.findOne({ token })
    } catch (error) {
      log.error('.[findToken] :: ', error)
      throw error
    }
  }

  private updateTokenPromises(tokens: ITokenRevoke[]) {
    const promises = tokens.map(async ({ token }) => {
      const query = { token }
      const update = { $set: { token } }
      const options = { upsert: true }
      return this.collection!.updateOne(query, update, options)
    })
    return Promise.all(promises)
  }

}
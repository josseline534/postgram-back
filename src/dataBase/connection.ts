import { MongoClient, ServerApiVersion } from 'mongodb'
import { ServiceEnv } from '../config'
import { Log } from '../utils'

const URI = ServiceEnv.DB_URL_CONNECT!

const BASE_LOG = '[DATABASE] ::'
const log = new Log(BASE_LOG)

const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})

let connection: typeof MongoClient | null = null

export const connectToMongoDB = async () => {
  try {
    if (!connection) {
      connection = await client.connect()
    }
    log.info('.[connectToMongoDB]:: Connected to MongoDB')
  } catch (error) {
    log.error('.[connectToMongoDB] :: Error connecting to MongoDB:', error)
    process.exit(1)
  }
}

export const getDataBase = async () => {
  try {
    if (!connection) {
      await connectToMongoDB()
    }
    return await client.db(ServiceEnv.DB_NAME)
  } catch (error) {
    log.error('.[getDataBase] :: Error getting to MongoDB:', error)
    throw error
  }
}

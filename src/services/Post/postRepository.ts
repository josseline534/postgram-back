import { Collection, Db, ObjectId, SortDirection } from 'mongodb'
import dayjs from 'dayjs'
import { getDataBase } from '../../dataBase/connection'
import { IPostFInd, IPostModel, IPostModelResponse } from '../../models/Post'
import { Log } from '../../utils'
import { HTTPErrors } from '../../errors'
import { PIPELINE } from './constants'
import { IOptionsFind, SortOrderEnum } from '../../interfaces'

const COLLECTION_NAME = 'posts'
const BASE_LOG = '[PostRepository] ::'
const log = new Log(BASE_LOG)

export class PostRepository {
  private static instance: PostRepository | null = null
  private db: Db | null = null
  private collection: Collection<IPostModel> | null = null

  public static async getInstance(): Promise<PostRepository> {
    try {
      if (!PostRepository.instance) {
        PostRepository.instance = new PostRepository()
      }
      return PostRepository.instance
    } catch (error) {
      log.error('.[getInstance] :: ', error)
      throw error
    }
  }

  private async getCollection() {
    this.db = await getDataBase()
    this.collection = this.db!.collection<IPostModel>(COLLECTION_NAME)
  }

  public async createPost(postData: IPostModel): Promise<IPostModelResponse> {
    try {
      const data = {
        ...postData,
        usersLike: [],
        isActive: true,
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString()
      }
      await this.getCollection()
      const result = await this.collection!.insertOne(data)
      return { _id: result.insertedId, ...data }
    } catch (error) {
      log.error('.[createPost] :: ', error)
      throw error
    }
  }

  public async listPosts(options: IOptionsFind) {
    try {
      await this.getCollection()
      const posts = await this.find({}, options)
      return posts
    } catch (error) {
      log.error('.[listPosts] :: ', error)
      throw error
    }
  }

  public async getPostOne(postId: string) {
    log.info(`.[getPostOne] Searching for user with ID: ${postId}`)
    try {
      await this.getCollection()
      const post = await this.collection!.findOne({ _id: new ObjectId(postId) })
      if (!post) throw HTTPErrors.notFound({ entity: 'post' })
      return post
    } catch (error) {
      log.error('.[getPostOne] :: ', error)
      throw error
    }
  }

  public async getPostById(postId: string) {
    log.info(`.[getPostById] Searching for post with ID: ${postId}`)
    const options = {
      pageNumber: 1,
      pageSize: 10,
      sortBy: { username: SortOrderEnum.ASC as SortDirection }
    }
    try {
      const posts = await this.find({ _id: new ObjectId(postId) }, options)
      if (!posts.length) throw HTTPErrors.notFound({ entity: 'post' })
      return posts[0]
    } catch (error) {
      log.error('.[getPostById] :: ', error)
      throw error
    }
  }

  public async getPostByAuthor(authorId: string, options: IOptionsFind) {
    log.info(
      `.[getPostByAuthor] Searching for post of author with ID: ${authorId}`
    )
    try {
      const posts = await this.find({ author: new ObjectId(authorId) }, options)
      if (!posts.length) throw HTTPErrors.notFound({ entity: 'post' })
      return posts
    } catch (error) {
      log.error('.[getPostByAuthor] :: ', error)
      throw error
    }
  }

  private async find(match: IPostFInd, options: IOptionsFind) {
    const skipDocuments = (options.pageNumber - 1) * options.pageSize

    try {
      await this.getCollection()
      const pipeline = [
        {
          $match: { ...match, isActive: true }
        },
        ...PIPELINE
      ]
      const posts = await this.collection!.aggregate(pipeline)
        .sort(options.sortBy)
        .skip(skipDocuments)
        .limit(options.pageSize)
        .toArray()
      return posts
    } catch (error) {
      log.error('.[find] :: ', error)
      throw error
    }
  }

  public async updatePost(
    postId: string,
    updatedFields: Partial<IPostModel>
  ): Promise<IPostModelResponse> {
    log.info(`.[update] Updating user with ID: ${postId}`)
    try {
      await this.getCollection()
      const filter = { _id: new ObjectId(postId), isActive: true }
      const update = {
        $set: { ...updatedFields, updatedAt: dayjs().toISOString() }
      }
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

      if (!result) throw HTTPErrors.notFound({ entity: `post: ${postId}` })

      return { ...result, ...updatedFields }
    } catch (error) {
      log.error('.[updatePost] Error:', error)
      throw error
    }
  }
}

import Joi from 'joi'
import { ID_DB_REGEX } from '../../../constants'
import { IPostModel } from '../../../models/Post'
import { ActionPostEnum, IActionPost } from '../../../handlers/Post/interface'
import { IQueryParams, SortOrderEnum } from '../../../interfaces'

export const ValidatePost = Joi.object<IPostModel>({
  title: Joi.string().required().empty(),
  description: Joi.string().required().empty()
})

export const ValidateUpdatePost = Joi.object<IPostModel>({
  title: Joi.string().empty(),
  description: Joi.string().empty()
})

export const ValidateActionPost = Joi.object<IActionPost>({
  action: Joi.string().valid(ActionPostEnum.DISLIKE, ActionPostEnum.LIKE).required(),
})

export const ValidatePostId = Joi.object({
  postId: Joi.string().required().regex(ID_DB_REGEX).empty().trim()
})

export const ValidateAuthorId = Joi.object({
  authorId: Joi.string().required().regex(ID_DB_REGEX).empty().trim()
})

export const ValidateQueryParams = Joi.object<IQueryParams>({
  pageNumber: Joi.number().min(1),
  pageSize: Joi.number().min(1),
  sortOrder: Joi.string().valid(SortOrderEnum.ASC, SortOrderEnum.DESC)
})
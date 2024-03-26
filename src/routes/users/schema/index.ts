import Joi from 'joi'
import { IUserModel } from '../../../models/User'
import { ID_DB_REGEX } from '../../../constants'
import { IQueryParams, SortOrderEnum } from '../../../interfaces'

export const ValidateUser = Joi.object<IUserModel>({
  email: Joi.string().email().required().empty().trim(),
  username: Joi.string().required().empty().trim(),
  password: Joi.string()
    .min(8)
    .max(16)
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]+$/)
    .required()
})

export const ValidateUpdateUser = Joi.object<IUserModel>({
  email: Joi.string().email().empty().trim(),
  username: Joi.string().empty().trim(),
  password: Joi.string()
    .min(8)
    .max(16)
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]+$/)
})

export const ValidateUserId = Joi.object({
  userId: Joi.string().required().regex(ID_DB_REGEX).empty().trim()
})

export const ValidateQueryParams = Joi.object<IQueryParams>({
  pageNumber: Joi.number().min(1),
  pageSize: Joi.number().min(1),
  sortOrder: Joi.string().valid(SortOrderEnum.ASC, SortOrderEnum.DESC)
})
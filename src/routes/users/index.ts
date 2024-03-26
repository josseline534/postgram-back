import { Router } from 'express'
import {
  CreateUser,
  ListUser,
  ByIdUser,
  UpdateUser,
  RemoveUser
} from '../../handlers/User'
import { SchemaValidator, authorizer } from '../../middlewares'
import { ValidateQueryParams, ValidateUpdateUser, ValidateUser, ValidateUserId } from './schema'

export const UsersRoutes = (router: Router): void => {
  router.route('/users').post([SchemaValidator(ValidateUser)], CreateUser)

  router
    .route('/users')
    .get([authorizer, SchemaValidator(ValidateQueryParams, 'query')], ListUser)
    .patch([authorizer, SchemaValidator(ValidateUpdateUser)], UpdateUser)
    .delete([authorizer], RemoveUser)

  router
    .route('/users/:userId')
    .get([authorizer, SchemaValidator(ValidateUserId, 'params')], ByIdUser)
}

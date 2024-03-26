import { Router } from 'express'
import { SchemaValidator, authorizer } from '../../middlewares'
import {
  ActionPost,
  ByAuthorPost,
  ByIdPost,
  CreatePost,
  ListPosts,
  RemovePost,
  UpdatePost
} from '../../handlers/Post'
import {
  ValidateActionPost,
  ValidateAuthorId,
  ValidatePost,
  ValidatePostId,
  ValidateQueryParams,
  ValidateUpdatePost
} from './schema'

export const PostsRoutes = (router: Router): void => {
  router
    .route('/posts')
    .post([authorizer, SchemaValidator(ValidatePost)], CreatePost)

  router
    .route('/posts')
    .get([authorizer, SchemaValidator(ValidateQueryParams, 'query')], ListPosts)

  router
    .route('/posts/author/:authorId')
    .get(
      [
        authorizer,
        SchemaValidator(ValidateAuthorId, 'params'),
        SchemaValidator(ValidateQueryParams, 'query')
      ],
      ByAuthorPost
    )

  router
    .route('/posts/:postId')
    .get([authorizer, SchemaValidator(ValidatePostId, 'params')], ByIdPost)
    .patch(
      [
        authorizer,
        SchemaValidator(ValidatePostId, 'params'),
        SchemaValidator(ValidateUpdatePost)
      ],
      UpdatePost
    )
    .delete([authorizer, SchemaValidator(ValidatePostId, 'params')], RemovePost)

  router
    .route('/posts/:postId/action')
    .patch(
      [
        authorizer,
        SchemaValidator(ValidatePostId, 'params'),
        SchemaValidator(ValidateActionPost)
      ],
      ActionPost
    )
}

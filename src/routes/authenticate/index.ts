import { Router } from 'express'
import { authorizer } from '../../middlewares'
import { Logout, SignIn } from '../../handlers/Authenticate'
import { RefreshToken } from '../../handlers/Authenticate/refresh'

export const AuthenticateRoutes = (router: Router): void => {
  router.route('/sign-in').get([], SignIn)
  router.route('/logout').post([authorizer], Logout)
  router.route('/refresh-token').get([], RefreshToken)
}

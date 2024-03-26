import { Router as ExpressRouter } from 'express'
import { HealthCheckRoutes } from './healthCheck'
import { UsersRoutes } from './users'
import { AuthenticateRoutes } from './authenticate'
import { PostsRoutes } from './post'

const router = ExpressRouter()

HealthCheckRoutes(router)
UsersRoutes(router)
AuthenticateRoutes(router)
PostsRoutes(router)

export const Router = router

import { Router } from 'express'
import { BasePath, HealthCheck } from '../handlers/HealthCheck'

export const HealthCheckRoutes = (router: Router): void => {
  router.route('/').all(BasePath)
  router.route('/health-check').all(HealthCheck)
}
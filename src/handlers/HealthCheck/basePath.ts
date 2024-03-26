import { NextFunction, Request, Response } from 'express'
const BASE_LOG = '[HANDLERS] BasePath::'
export const BasePath = (_req: Request, res: Response, next: NextFunction) => {
  console.info(BASE_LOG)
  try {
    res.redirect('/api/v1/health-check')
  } catch (error) {
    console.error(`${BASE_LOG} error: `, error)
    next(error)
  }
}
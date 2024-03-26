import { type Request, type ErrorRequestHandler, type Response } from 'express'

import { HTTPErrors, type IHTTPError } from '../errors'
import { Log } from '../utils'

const ERROR_TAG = '[ERROR-HANDLER]'

// eslint-disable-next-line max-params
export const ErrorHandler: ErrorRequestHandler = (error: IHTTPError, { method, originalUrl }, res: Response) => {
  if ('status' in error) {
    Log.error(ERROR_TAG, { method, originalUrl, status: error.status, message: error.message, type: error.type })
    delete error.url
    res.status(error.status).json(error)
  } else {
    Log.error(ERROR_TAG, { method, originalUrl }, error)
    res.status(500).json(HTTPErrors.internalServerError())
  }
}

export const NotFoundErrorHandler = (_req: Request, res: Response): void => {
  res.status(404).json(HTTPErrors.notFound())
}

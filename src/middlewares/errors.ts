import { Request, ErrorRequestHandler, Response } from 'express'

import { HTTPErrors, IHTTPError } from '../errors'
import { Log } from '../utils'

const ERROR_TAG = '[ERROR-HANDLER]'
const log = new Log(ERROR_TAG)

// eslint-disable-next-line @typescript-eslint/no-unused-vars, max-params
export const ErrorHandler: ErrorRequestHandler = (error: IHTTPError, { method, originalUrl }, res: Response, _) => {
  if ('status' in error) {
    log.error(ERROR_TAG, { method, originalUrl, status: error.status, message: error.message, type: error.type })
    delete error.url
    res.status(error.status).json(error)
  } else {
    log.error(ERROR_TAG, { method, originalUrl }, error)
    res.status(500).json(HTTPErrors.internalServerError())
  }
}

export const NotFoundErrorHandler = (_req: Request, res: Response): void => {
  res.status(404).json(HTTPErrors.notFound())
}

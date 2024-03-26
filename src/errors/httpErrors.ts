import { HTTPErrorEnum, type IHTTPError, type IHTTPErrorParams } from './interfaces'

/**
 * @param {IHTTPErrorParams} details
 * @param {number} details.status
 * @param {string} [details.message]
 * @param {string} [details.entity]
 * @param {string} [details.url]
 * @param {THTTPError} details.type
 * @param {unknown} details.error
 */
export const HTTPErrors = {
  internalServerError: (details?: IHTTPErrorParams): IHTTPError =>
    ({ status: 500, entity: details?.entity, message: details?.message ?? HTTPErrorEnum.INTERNAL_SERVER_ERROR, type: HTTPErrorEnum.INTERNAL_SERVER_ERROR, error: details?.error }),

  invalidSchema: (details?: IHTTPErrorParams): IHTTPError =>
    ({ status: 400, entity: details?.entity, message: details?.message ?? HTTPErrorEnum.INVALID_SCHEMA, type: HTTPErrorEnum.INVALID_SCHEMA, error: details?.error }),

  badRequest: (details?: IHTTPErrorParams): IHTTPError =>
    ({ status: 400, entity: details?.entity, message: details?.message ?? HTTPErrorEnum.BAD_REQUEST, type: HTTPErrorEnum.BAD_REQUEST, error: details?.error }),

  notFound: (details?: IHTTPErrorParams): IHTTPError =>
    ({ status: 404, entity: details?.entity, message: details?.message ?? HTTPErrorEnum.NOT_FOUND, type: HTTPErrorEnum.NOT_FOUND, error: details?.error }),

  eventIsRequired: (details?: IHTTPErrorParams): IHTTPError =>
    ({ status: 400, entity: details?.entity, message: details?.message ?? HTTPErrorEnum.EVENT_IS_REQUIRED, type: HTTPErrorEnum.EVENT_IS_REQUIRED, error: details?.error }),

  forbidden: (details?: IHTTPErrorParams): IHTTPError =>
    ({ status: 403, entity: details?.entity, message: details?.message ?? HTTPErrorEnum.FORBIDDEN, type: HTTPErrorEnum.FORBIDDEN, error: details?.error }),

  unauthorized: (details?: IHTTPErrorParams): IHTTPError =>
    ({ status: 401, entity: details?.entity, message: details?.message ?? HTTPErrorEnum.UNAUTHORIZED, type: HTTPErrorEnum.UNAUTHORIZED, error: details?.error })
}

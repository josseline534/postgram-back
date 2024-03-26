export enum HTTPErrorEnum {
  BAD_REQUEST = 'bad_request',
  INTERNAL_SERVER_ERROR = 'internal_server_error',
  NOT_FOUND = 'not_found',
  INVALID_SCHEMA = 'invalid_schema',
  EVENT_IS_REQUIRED = 'event_is_required',
  FORBIDDEN = 'forbidden',
  UNAUTHORIZED = 'unauthorized'
}

type THTTPError = `${HTTPErrorEnum}`

export interface IHTTPError {
  status: number
  message: string
  entity?: string
  type?: THTTPError
  error: unknown
  url?: string
}

export interface IHTTPErrorParams extends Partial<Omit<IHTTPError, 'status' | 'type'>> { }

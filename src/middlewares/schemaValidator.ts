import { type NextFunction, type Request, type Response } from 'express'
import Joi from 'joi'

import { type IHTTPErrorParams, HTTPErrors } from '../errors'

type checkType = (keyof Pick<Request, 'body' | 'query' | 'params'>)

export const SchemaValidator = (schema: unknown, check: checkType = 'body') =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (Joi.isSchema(schema)) {
        const { error, value }: Joi.ValidationResult = schema.validate(req[check], { abortEarly: false })
        if (error) {
          throw HTTPErrors.invalidSchema(getJoiError(error))
        } else {
          req[check] = value
          next()
        }
      } else throw HTTPErrors.invalidSchema()
    } catch (error) {
      next(error)
    }
  }

const getJoiError = ({ details }: Joi.ValidationError): IHTTPErrorParams => {
  const { message }: { message: string } = details[0]
  return { message: message.replaceAll(' ', '_').replaceAll('"', '') }
}

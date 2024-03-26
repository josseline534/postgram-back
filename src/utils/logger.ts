/* eslint-disable no-console */
import { type AxiosError } from 'axios'

import { ServiceEnv } from '../config'
import { NodeEnvEnum } from '../config/interfaces/env'

const IS_MASTER: boolean = ServiceEnv.NODE_ENV === NodeEnvEnum.PRO

type LogType = AxiosError | unknown | object | string | number | Array<Record<string, unknown>>

export class Log {
  TAG: string
  serviceInfo: LogType[]

  constructor(TAG: string, ...serviceInfo: LogType[]) {
    this.serviceInfo = serviceInfo || []
    this.TAG = TAG
  }

  info(...rest: LogType[]): void {
    Log.info(this.TAG, ...this.serviceInfo, ...rest)
  }

  log(...rest: LogType[]): void {
    if (IS_MASTER) return

    Log.log(this.TAG, ...this.serviceInfo, ...rest)
  }

  error(...rest: LogType[]): void {
    Log.error(this.TAG, ...this.serviceInfo, ...rest)
  }

  static info(...rest: LogType[]): void {
    console.info('INFO', new Date(), ...rest.map(toString))
  }

  static log(...rest: LogType[]): void {
    if (IS_MASTER) return

    console.log('LOG', new Date(), ...rest.map(toString))
  }

  static error(...rest: LogType[]): void {
    console.error('ERROR', new Date(), ...rest.map(toString))
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toString(data: any): string | number | unknown {
  if (data?.response?.data) {
    return JSON.stringify({
      status: data.response.status,
      statusText: data.response.statusText,
      url: data.config.url,
      method: data.config.method,
      error: data.response.data
    })
  }

  if (data instanceof Error) {
    return JSON.stringify({ message: data.message, stack: data.stack ?? '' })
  }

  return typeof data === 'object' ? JSON.stringify(data) : data
}

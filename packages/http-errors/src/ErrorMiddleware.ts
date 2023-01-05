import { HttpError } from './HttpError.js'
import { ErrorFactory, OptionsErrorFactory } from './ErrorFactory.js'

export interface ErrorMiddlewareOptions {
  debugOnClient: Boolean
  debugOnServer: Boolean
  skipClientError: Boolean
}

export const errorsMiddleware = (options?: ErrorMiddlewareOptions) => {
  let opt: ErrorMiddlewareOptions = options || {
    debugOnClient: false,
    debugOnServer: false,
    skipClientError: false
  }
  const middleware: Function = (err: Error & HttpError, req, res, next) => {
    const statusCode = err.statusCode || 500

    if (options.debugOnServer && ((!options.skipClientError && statusCode < 500) || statusCode >= 500)) console.log(err)
    if (!err.statusCode) {
      let options: OptionsErrorFactory = {
        message: err.message,
        error: err
      }
      err = ErrorFactory.InternalServerError(options)
    }

    const stack = options.debugOnClient ? err.stack : undefined
    const errorCode = err.errorCode ? 'E' + err.errorCode.toString().padStart(5, '0') : undefined
    const details = err.details || undefined

    res.status(statusCode).json({
      statusCode: err.statusCode,
      errorCode,
      message: err.message,
      details,
      stack
    } as any)
  }
  return middleware
}

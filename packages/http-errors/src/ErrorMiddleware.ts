import { HttpError } from './HttpError'
import { ErrorFactory, OptionsErrorFactory } from './ErrorFactory'

export interface ErrorMiddlewareOptions {
  debugClient: Boolean
  debugServer: Boolean
  skipClientError: Boolean
}

export const errorsMiddleware = (options?: ErrorMiddlewareOptions) => {
  let opt: ErrorMiddlewareOptions = options || {
    debugClient: false,
    debugServer: false,
    skipClientError: false
  }
  const middleware: Function = (err: Error & HttpError, req, res, next) => {
    const statusCode = err.statusCode || 500

    if (options.debugServer && ((!options.skipClientError && statusCode < 500) || statusCode >= 500)) console.log(err)
    if (!err.statusCode) {
      let options: OptionsErrorFactory = {
        message: err.message,
        error: err
      }
      err = ErrorFactory.InternalServerError(options)
    }

    const stack = options.debugClient ? err.stack : undefined
    const errorCode = err.errorCode ? 'E' + err.errorCode.toString().padStart(5, '0') : undefined
    const details = err.details || undefined

    res.status(statusCode).json({
      statusCode: err.statusCode,
      errorCode: err.errorCode,
      message: err.message,
      details: err.details,
      stack: err.stack
    })
  }
}

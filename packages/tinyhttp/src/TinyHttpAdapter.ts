import { AdapterHttpModule, BodyFormat, Handler } from '@bubojs/api'
import { App, NextFunction, Request, Response } from '@tinyhttp/app'
import jsonwebtoken from 'jsonwebtoken'
import { json, raw, text, urlencoded } from 'milliparsec'

export class TinyHttpAdapter implements AdapterHttpModule<App> {
  public app: App
  private onError?: (error: any, req: Request, res: Response, next?: NextFunction) => void = undefined
  constructor() {
    this.app = new App()
    // this.app.all(json()) //get post put patch delete
  }
  public use(path: string, router: any) {
    if (router.app) {
      this.app.use(path, router.app)
      router.app.onError = this.onError
    } else this.app.use(path, router)
  }

  public init() {
    return
  }

  public initRouter() {
    return new TinyHttpAdapter()
  }

  // TODO Move away from here, it's a middleware
  public useTokenStrategy(accessTokenSecret: any, strategy: Function) {
    this.app.use(async (req: any, res: any, next: Function) => {
      const authHeader = req.get('Authorization')
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7, authHeader.length)
        const decoded: any = jsonwebtoken.verify(token, accessTokenSecret)
        const { id } = decoded
        const user = await strategy(id)
        req.user = user
      }
      next()
    })
  }

  public useErrorHandler(handler?: (error: any, req: Request, res: Response, next?: NextFunction) => void) {
    const defaultHandler = (error: any, req: Request, res: Response, next?: NextFunction) => {
      const statusCode = error.statusCode || 500
      const { message } = error
      res.status(statusCode).json({ statusCode, message })
    }
    handler = handler ?? defaultHandler
    this.onError = handler
    this.app.onError = this.onError
    return
  }

  public async startServer(port?: number, credentials?: { key: string; cert: string }) {
    const server = this.app.listen(port || 3000)
    console.log(`listened to ${port || 3000}`)
    return server
  }
  public stopServer() {}

  public get(path: string, beforeMiddlewares: any = [], handler: any, afterMiddlewares: any = []) {
    return this.app.get(path, beforeMiddlewares, handler, afterMiddlewares, this.response())
  }

  public async post(
    path: string,
    bodyFormat: BodyFormat,
    beforeMiddlewares: any = [],
    handler: any,
    afterMiddlewares: any = []
  ) {
    return this.app.post(
      path,
      this.useBodyFormat(bodyFormat),
      beforeMiddlewares,
      handler,
      afterMiddlewares,
      this.response()
    )
  }

  public async put(
    path: string,
    bodyFormat: BodyFormat,
    beforeMiddlewares: any = [],
    handler: any,
    afterMiddlewares: any = []
  ) {
    return this.app.put(
      path,
      this.useBodyFormat(bodyFormat),
      beforeMiddlewares,
      handler,
      afterMiddlewares,
      this.response()
    )
  }

  public async patch(
    path: string,
    bodyFormat: BodyFormat,
    beforeMiddlewares: any = [],
    handler: any,
    afterMiddlewares: any = []
  ) {
    return this.app.patch(
      path,
      this.useBodyFormat(bodyFormat),
      beforeMiddlewares,
      handler,
      afterMiddlewares,
      this.response()
    )
  }

  public delete(
    path: string,
    bodyFormat: BodyFormat,
    beforeMiddlewares: any = [],
    handler: any,
    afterMiddlewares: any = []
  ) {
    return this.app.delete(
      path,
      this.useBodyFormat(bodyFormat),
      beforeMiddlewares,
      handler,
      afterMiddlewares,
      this.response()
    )
  }

  /**
   * Send the response in the end of all process (before middlewares, method handler and after middlewares).
   * @returns the response of http request
   */
  public response(): Handler {
    return (req, res, next) => {
      if (!req?.result) return res.status(200)
      else {
        return res.status(200).json(req.result)
      }
    }
  }

  private static autoParse(req, _res, next: NextFunction) {
    const enum encoding {
      JSON = 'application/json',
      TEXT = 'text/plain',
      URL_ENCODED = 'application/x-www-form-urlencoded',
      MULTIPART_FORM = 'multipart/form-data'
    }
    const contentType = req.headers['content-type']
    if (contentType === encoding.JSON) {
      json()(req, _res, next)
      return
    }
    if (contentType === encoding.TEXT) {
      text()(req, _res, next)
      return
    }
    if (contentType === encoding.URL_ENCODED) {
      urlencoded()(req, _res, next)
      return
    }
    if (contentType === encoding.MULTIPART_FORM) {
      next()
      return
    }
    next()
    return
  }

  /**
   * Use the right body formatter for tinyhttp
   * @param path of the url request
   * @param bodyFormat the body format
   * @returns
   */
  public useBodyFormat(bodyFormat: BodyFormat): Handler {
    switch (bodyFormat) {
      case BodyFormat.RAW:
        return raw()
      case BodyFormat.TEXT:
        return text()
      case BodyFormat.JSON:
        return json()
      case BodyFormat.AUTO:
        return TinyHttpAdapter.autoParse
      case BodyFormat.SKIP:
        return (_req, _res, next: Function) => {
          next()
        }
      case BodyFormat.URL_ENCODED:
        return urlencoded()
      default:
        return TinyHttpAdapter.autoParse
    }
  }
}

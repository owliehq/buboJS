import { AdapterHttpModule, BodyFormat, Handler, json, raw, text } from '@bubojs/api'
import { App } from '@tinyhttp/app'
import { Server } from 'http'
import jsonwebtoken from 'jsonwebtoken'

export class TinyHttpAdapter implements AdapterHttpModule<App> {
  public app: App
  constructor() {
    this.app = new App()
    // this.app.all(json()) //get post put patch delete
  }
  public use(path: string, router: any) {
    if (router.app) this.app.use(path, router.app)
    else this.app.use(path, router)
  }

  public init() {
    return
  }

  public initRouter() {
    return new TinyHttpAdapter()
  }

  public useTokenStrategy(accessTokenSecret: any, strategy: Function) {
    this.app.use((req: any, res: any, next: Function) => {
      const authHeader = req.get('Authorization')
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7, authHeader.length)
        const decoded: any = jsonwebtoken.verify(token, accessTokenSecret)
        const { id } = decoded
        const user = strategy(id)
        req.user = user
      }
      next()
    })
  }

  public startServer() {
    const server = this.app.listen(3000)
    console.log('listened to 3000')
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
      return res.status(200).send(req.result)
    }
  }

  public listen(port: number): Server {
    return this.app.listen(port)
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
      default:
        return json()
    }
  }
}

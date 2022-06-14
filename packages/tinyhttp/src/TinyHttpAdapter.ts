import { App, Request, Response } from '@tinyhttp/app'
import { AdapterHttpModule, BodyFormat, raw, json, text, Handler } from '@bubojs/api'
import { Server } from 'http'

export class TinyHttpAdapter implements AdapterHttpModule<App> {
  public app: App
  constructor() {
    this.app = new App()
    // this.app.all(json()) //get post put patch delete
  }
  public use(path: string, router: TinyHttpAdapter) {
    this.app.use(path, router.app)
  }

  public init() {
    return
  }

  public initRouter() {
    return new TinyHttpAdapter()
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

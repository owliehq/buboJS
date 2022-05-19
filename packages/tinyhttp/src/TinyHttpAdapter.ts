import { App, Handler, Request, Response } from '@tinyhttp/app'
import { AdapterHttpModule, BodyFormat, raw, json, text } from '@bubojs/api'
import { Server } from 'http'

export class TinyHttpAdapter implements AdapterHttpModule<App> {
  public app: App
  constructor() {
    this.app = new App()
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

  public get(path: string, handler: any) {
    return this.app.get(path, handler)
  }

  public post(path: string, bodyFormat: BodyFormat, handler: any) {
    this.app.use(path, this.useBodyFormat(path, bodyFormat))
    return this.app.post(path, handler)
  }

  public put(path: string, bodyFormat: BodyFormat, handler: any) {
    this.app.use(path, this.useBodyFormat(path, bodyFormat))
    return this.app.put(path, handler)
  }

  public patch(path: string, bodyFormat: BodyFormat, handler: any) {
    this.app.use(path, this.useBodyFormat(path, bodyFormat))
    return this.app.patch(path, handler)
  }

  public delete(path: string, bodyFormat: BodyFormat, handler: any) {
    this.app.use(path, this.useBodyFormat(path, bodyFormat))
    return this.app.delete(path, handler)
  }

  public listen(port: number): Server {
    return this.app.listen(port)
  }

  public useBodyFormat(path: string, bodyFormat: BodyFormat): Handler {
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

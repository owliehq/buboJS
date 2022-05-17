import { App } from '@tinyhttp/app'
import { AdapterHttpModule } from '@bubojs/api'
import { Server } from 'http'

export class TinyHttpAdapter implements AdapterHttpModule<App> {
  public app: App
  constructor() {
    this.app = new App()
  }

  public init() {
    return
  }

  public initRouter() {
    return new App()
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

  public post(path: string, handler: any) {
    return this.app.post(path, handler)
  }

  public put(path: string, handler: any) {
    return this.app.put(path, handler)
  }

  public patch(path: string, handler: any) {
    return this.app.patch(path, handler)
  }

  public delete(path: string, handler: any) {
    return this.app.delete(path, handler)
  }

  public use(path: string, router: App) {
    return this.app.use(path, router)
  }

  public listen(port: number): Server {
    return this.app.listen(port)
  }
}

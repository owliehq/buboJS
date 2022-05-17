import { App } from '@tinyhttp/app'
import { AdapterHttpModule } from '@bubojs/api'
import { BodyFormat } from '@bubojs/api/src/interfaces/DecoratorOptions'
import { raw, json, text } from 'milliparsec'

export class TinyHttpAdapter implements AdapterHttpModule {
  public app: App
  constructor() {
    this.app = new App()
  }

  public init() {
    return
  }

  public startServer() {
    const server = this.app.listen(3000)
    console.log('listened to 3000')
    return server
  }
  public stopServer() {}

  public get(path: string, handler: any) {
    this.app.get(path, handler)
  }

  public use(path: string, bodyFormat: BodyFormat) {
    console.log('bodyFormat', bodyFormat)
    switch (bodyFormat) {
      case BodyFormat.RAW:
        this.app.use(path, raw())
        break
      case BodyFormat.TEXT:
        this.app.use(path, text())
        break
      default:
        this.app.use(path, json())
    }
  }
}

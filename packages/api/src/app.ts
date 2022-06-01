import { Server } from 'http'
import { AdapterHttpModule } from './adapters'
import { HttpResolver } from './HttpResolver'
import { ServerConfig } from './interfaces'
import { MetadataManager } from './MetadataManager'
export class App {
  public server: AdapterHttpModule<any>

  public initHttpModule(adapter: AdapterHttpModule<any>): Server {
    this.server = adapter

    const controllerResolver = new HttpResolver(adapter)
    controllerResolver.controllerRevolve(MetadataManager.meta)

    return this.server.listen(3000)
  }
}

import glob from 'fast-glob'
import { Server } from 'http'
import { pathToFileURL } from 'url'
import { AdapterHttpModule } from './adapters'
import { HttpResolver } from './HttpResolver'
import { MetadataManager } from './MetadataManager'
import { ServiceResolver } from './ServiceResolver'

export class App {
  public server: AdapterHttpModule<any>

  constructor() {}

  public async initHttpModule(adapter: AdapterHttpModule<any>): Promise<Server> {
    this.server = adapter

    await this.loadControllers()

    const controllerResolver = new HttpResolver(adapter)
    controllerResolver.controllerRevolve(MetadataManager.meta)

    this.initApiModule()

    return this.server.listen(3000)
  }

  public initApiModule() {
    const serviceResolver = new ServiceResolver()
    serviceResolver.serviceResolve(MetadataManager.meta)
  }

  public async loadControllers() {
    const controllerFound = glob.sync(`**/*Controller.ts`, {
      absolute: true,
      deep: 5,
      ignore: ['**/node_modules/**']
    })

    const promises = controllerFound.map(async (file: string) => {
      return await import(pathToFileURL(file).toString()).then(() => {
        const [controllerName] = file.split('/').slice(-1)
      })
    })

    return Promise.all(promises)
  }
}

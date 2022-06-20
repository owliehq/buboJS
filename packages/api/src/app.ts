import glob from 'fast-glob'
import { Server } from 'http'
import * as path from 'path'
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

  public use(base: Function)
  public use(base: string, fn: Function)
  public use(base: Function | string, fn?: Function) {
    let path = typeof base === 'string' ? base : '/'
    let handler = fn ? fn : base
    this.server.use(path, handler)
  }

  private async loadControllers() {
    const controllerFound = glob.sync(`**/*Controller.ts`, {
      absolute: true,
      deep: 5,
      ignore: ['**/node_modules/**']
    })

    const promises = controllerFound.map((file: string) => {
      return import(path.resolve(file)).then(() => {
        const [controllerName] = file.split('/').slice(-1)
      })
    })

    return Promise.all(promises)
  }
}

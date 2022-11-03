import glob from 'fast-glob'
import { pathToFileURL } from 'url'
import { AdapterHttpModule } from './adapters'
import { HttpResolver } from './HttpResolver'
import { MetadataManager } from './MetadataManager'
import { ServiceResolver } from './ServiceResolver'

export interface AppOptions {
  port?: number
  beforeAllMiddlewares?: Array<{ path?: string; function: any }>
  errorMiddleware?: any
  fileExtension?: 'js' | 'ts'
}

export class App {
  public server: AdapterHttpModule<any>

  constructor() {}

  public async initHttpModule(adapter: AdapterHttpModule<any>, options?: AppOptions) {
    this.server = adapter
    adapter.useErrorHandler(options?.errorMiddleware)
    await this.loadControllers(options?.fileExtension)

    const controllerResolver = new HttpResolver(adapter)
    options?.beforeAllMiddlewares?.forEach(middleware => {
      adapter.use('/', middleware)
    })
    controllerResolver.controllerRevolve(MetadataManager.meta)

    this.initApiModule()
    return this.server.listen(options?.port || 3000)
  }

  public initApiModule() {
    const serviceResolver = new ServiceResolver()
    serviceResolver.serviceResolve(MetadataManager.meta)
  }

  public listen(port: number) {
    MetadataManager.meta.modules.forEach(module => {
      this.server.use(module.path, module.handler)
    })
    return this.server.listen(port)
  }

  public use(base: (req: any, res: any, next: Function) => any)
  public use(base: string, fn: (req: any, res: any, next: Function) => any)
  public use(
    base: string | ((req: any, res: any, next: Function) => any),
    fn?: (req: any, res: any, next: Function) => any
  ) {
    let path = typeof base === 'string' ? base : '/'
    let handler = fn ? fn : base
    MetadataManager.meta.modules.push({ path, handler })
  }

  private async loadControllers(extension: 'ts' | 'js' = 'ts') {
    const controllerFound = glob.sync(`**/*Controller.${extension}`, {
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

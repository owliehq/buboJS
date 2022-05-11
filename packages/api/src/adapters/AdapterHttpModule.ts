import { Server } from 'http'

export interface AdapterHttpModule {
  app: any

  init(): any

  startServer(): Server
  stopServer(): void

  get(path: string, handler: Function)
  // post(path: string, handler: Function);
  // route(method: RouteMethod, path: string, handler: Function);
}

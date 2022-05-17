import { Server } from 'http'

/**
 * adapt http modules (tinyhttp, fastify, express) to main api module
 */
export interface AdapterHttpModule<App> {
  app: any

  init(): any
  initRouter(): App

  startServer(): Server
  stopServer(): void

  get(path: string, handler: Function)
  post(path: string, handler: Function)
  put(path: string, handler: Function)
  patch(path: string, handler: Function)
  delete(path: string, handler: Function)
  // route(method: RouteMethod, path: string, handler: Function);

  use(path: string, router: App)

  listen(port: number)
}

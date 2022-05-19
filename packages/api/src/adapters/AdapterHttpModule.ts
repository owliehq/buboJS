import { Server } from 'http'
import { BodyFormat } from '../interfaces'

/**
 * adapt http modules (tinyhttp, fastify, express) to main api module
 */
export interface AdapterHttpModule<App> {
  app: any

  init(): any
  initRouter(): any

  startServer(): Server
  stopServer(): void

  get(path: string, handler: Function)
  post(path: string, formatter: BodyFormat, handler: Function)
  put(path: string, formatter: BodyFormat, handler: Function)
  patch(path: string, formatter: BodyFormat, handler: Function)
  delete(path: string, formatter: BodyFormat, handler: Function)
  // route(method: RouteMethod, path: string, handler: Function);

  use(path: string, router: any)
  useBodyFormat(path: string, bodyFormat: BodyFormat)

  listen(port: number)
}

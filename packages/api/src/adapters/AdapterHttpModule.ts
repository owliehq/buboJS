import { Server } from 'http'
import { BodyFormat, Handler } from '../interfaces/index.js'

/**
 * adapt http modules (tinyhttp, fastify, express) to main api module
 */
export interface AdapterHttpModule<App> {
  app: any

  init(): any
  initRouter(): any

  useErrorHandler(middleware: any)
  useTokenStrategy(accessTokenSecret: string, strategy: Function): void

  startServer(port: number, credentials?: { key: string; cert: string }): Server | Promise<Server>
  stopServer(): void

  get(path: string, beforeMiddlewares: any[], handler: Function, afterMiddlewares: any[])
  post(path: string, formatter: BodyFormat, beforeMiddlewares: any[], handler: Function, afterMiddlewares: any[])
  put(path: string, formatter: BodyFormat, beforeMiddlewares: any[], handler: Function, afterMiddlewares: any[])
  patch(path: string, formatter: BodyFormat, beforeMiddlewares: any[], handler: Function, afterMiddlewares: any[])
  delete(path: string, formatter: BodyFormat, beforeMiddlewares: any[], handler: Function, afterMiddlewares: any[])
  // route(method: RouteMethod, path: string, handler: Function);

  /**
   * This method just send the response in the end of all process (before middlewares, method handler and after middlewares).
   * Use req.result to get the result to send.
   */
  response(): Handler

  use(path: string, router: any)

  /**
   * Use the right body formatter
   * @param path of the url request
   * @param bodyFormat the body format
   * @returns
   */
  useBodyFormat(path: string, bodyFormat: BodyFormat)
}

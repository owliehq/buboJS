import { MiddlewareMetadata, MiddlewarePosition } from '../../interfaces/index.js'
import { MetadataManager } from '../../MetadataManager.js'

/**
 * BeforeMiddleware decorator. The function middleware will be executed before the main method
 * @param middleware the middleware
 * @returns
 */
export const BeforeMiddleware =
  (middleware: MiddlewareMetadata | MiddlewareMetadata[]) => (target: any, propertyKey: string) => {
    if (Array.isArray(middleware)) {
      for (const middlewareElement of middleware) {
        MetadataManager.setMiddlewareMetadata(
          target.constructor.name,
          propertyKey,
          MiddlewarePosition.BEFORE,
          middlewareElement
        )
      }
    } else {
      MetadataManager.setMiddlewareMetadata(target.constructor.name, propertyKey, MiddlewarePosition.BEFORE, middleware)
    }
  }

/**
 * AfterMiddleware decorator. The function middleware will be executed after the main method
 * @param middleware the middleware
 * @returns
 */
export const AfterMiddleware = (middleware: MiddlewareMetadata) => (target: any, propertyKey: string) => {
  MetadataManager.setMiddlewareMetadata(target.constructor.name, propertyKey, MiddlewarePosition.AFTER, middleware)
}

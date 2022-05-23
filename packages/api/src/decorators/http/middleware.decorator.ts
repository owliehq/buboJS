import { MiddlewareMetadata, MiddlewarePosition } from '../../interfaces'
import { MetadataManager } from '../../MetadataManager'

/**
 * BeforeMiddleware decorator. The function middleware will be executed before the main method
 * @param middleware the middleware
 * @returns
 */
export const BeforeMiddleware = (middleware: MiddlewareMetadata) => (target: any, propertyKey: string) => {
  MetadataManager.setMiddlewareMetadata(target.constructor.name, propertyKey, MiddlewarePosition.BEFORE, middleware)
}

/**
 * AfterMiddleware decorator. The function middleware will be executed after the main method
 * @param middleware the middleware
 * @returns
 */
export const AfterMiddleware = (middleware: MiddlewareMetadata) => (target: any, propertyKey: string) => {
  MetadataManager.setMiddlewareMetadata(target.constructor.name, propertyKey, MiddlewarePosition.AFTER, middleware)
}

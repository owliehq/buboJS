import { RouteMethod } from '../../enums/index.js'
import { MiddlewarePosition } from '../../interfaces/index.js'
import { BodyFormat, MethodOptions } from '../../interfaces/DecoratorOptions.js'
import { MetadataManager } from '../../MetadataManager.js'

/**
 * build method of route decorators
 * it save the route method metadata
 * @param method
 * @returns
 */
const buildMethod =
  (method: RouteMethod) =>
  (subRoute: string = '/', options?: MethodOptions) =>
  (target: any, propertyKey: string, descriptor: PropertyDescriptor): any => {
    const bodyFormat = options?.bodyFormat ? options.bodyFormat : BodyFormat.AUTO

    const parameters = MetadataManager.getParametersMetadata(target.constructor.name, propertyKey)
    // Get middlewares to run before the method handler
    const beforeMiddlewares = MetadataManager.getMiddlewaresMetadata(
      target.constructor.name,
      propertyKey,
      MiddlewarePosition.BEFORE
    )
    // Get middlewares to run after the method handler
    const afterMiddlewares = MetadataManager.getMiddlewaresMetadata(
      target.constructor.name,
      propertyKey,
      MiddlewarePosition.AFTER
    )
    let handler: (this: any, req: any, res: any, next: Function) => Promise<void>
    if (options?.rawHandler) {
      //TODO find a way to type this
      /*
      const value = descriptor.value()
      handler = value instanceof Promise ? await value : value
         */
      handler = descriptor.value()
    } else {
      handler = async function (this: any, req: any, res: any, next: Function) {
        try {
          //apply parameters decorator on function
          const result = await descriptor.value.apply(
            this,
            parameters ? Object.values(parameters).map((param: any) => param.getValue(req)) : []
          )

          // We save result in result property of req
          // This result will be send in response() method. See AdapterHttpModule.ts
          req.result = result
          next()
        } catch (error) {
          const statusCode = error.statusCode || 500
          const { message } = error
          await res.status(statusCode).json({ statusCode, message })
        }
      }
    }

    MetadataManager.setRouteMetadata(target.constructor.name, propertyKey, {
      path: subRoute,
      method,
      parameters,
      handler,
      bodyFormat,
      middlewares: {
        before: beforeMiddlewares,
        after: afterMiddlewares
      }
    })
  }

/**
 * decorator that generate custom GET route
 */
export const Get = buildMethod(RouteMethod.GET)
/**
 * decorator that generate custom POST route
 */
export const Post = buildMethod(RouteMethod.POST)
/**
 * decorator that generate custom PUT route
 */
export const Put = buildMethod(RouteMethod.PUT)
/**
 * decorator that generate custom PATCH route
 */
export const Patch = buildMethod(RouteMethod.PATCH)
/**
 * decorator that generate custom DELETE route
 */
export const Delete = buildMethod(RouteMethod.DELETE)

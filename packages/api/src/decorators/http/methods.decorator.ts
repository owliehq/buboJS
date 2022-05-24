import { RouteMethod } from '../../enums'
import { MiddlewarePosition } from '../../interfaces'
import { BodyFormat, MethodOptions } from '../../interfaces/DecoratorOptions'
import { MetadataManager } from '../../MetadataManager'

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
    const { bodyFormat } = options ? options : { bodyFormat: BodyFormat.JSON }

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

    const handler = async function (this: any, req: any, res: any, next: Function) {
      //apply parameters decorator on function
      const result = descriptor.value.apply(
        this,
        parameters ? Object.values(parameters).map((param: any) => param.getValue(req)) : []
      )

      // We save result in result property of req
      // This result will be send in response() method. See AdapterHttpModule.ts
      req.result = result
      next()
    }

    MetadataManager.setRouteMetadata(target.constructor.name, propertyKey, {
      path: subRoute,
      method,
      parameters,
      handler,
      bodyFormat,
      beforeMiddlewares,
      afterMiddlewares
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

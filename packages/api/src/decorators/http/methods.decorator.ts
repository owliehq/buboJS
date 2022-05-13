import { RouteMethod } from '../../enums'
import { MetadataManager } from '../../MetadataManager'

/**
 * build method of route decorators
 * it save the route method metadata
 * @param method
 * @returns
 */
const buildMethod =
  (method: RouteMethod) =>
  (subRoute: string = '/') =>
  (target: any, propertyKey: string, descriptor: PropertyDescriptor): any => {
    let handler

    const parameters = MetadataManager.getParametersMetadata(target.constructor.name, propertyKey)

    handler = async function (this: any, req: any, res: any) {
      //apply parameters decorator on function
      const result = descriptor.value.apply(
        this,
        parameters ? Object.values(parameters).map((param: any) => param.getValue(req)) : []
      )

      return res.status(200).send(result)
    }

    MetadataManager.setRouteMetadata(target.constructor.name, propertyKey, {
      path: subRoute,
      method,
      parameters,
      handler
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

export interface MethodOptions {}

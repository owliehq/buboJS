import { RouteMethod } from '../../enums'
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
    let handler

    const { bodyFormat } = options ? options : { bodyFormat: BodyFormat.JSON }

    const parameters = MetadataManager.getParametersMetadata(target.constructor.name, propertyKey)

    handler = async function (this: any, req: any, res: any) {
      //apply parameters decorator on function
      const result = descriptor.value.apply(
        this,
        parameters ? Object.values(parameters).map((param: any) => param.getValue(req)) : []
      )

      //TODO check Content-Type of response
      return res.status(200).send(result)
    }

    MetadataManager.setRouteMetadata(target.constructor.name, propertyKey, {
      path: subRoute,
      method,
      parameters,
      handler,
      bodyFormat
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

import { DefaultRouteBuilder } from '../../builder'
import { DefaultActions, RouteMetadata } from '../../interfaces'
import { MetadataManager } from '../../MetadataManager'
import { BuboRepository } from '../../models'
import { toSnakeCase } from '../../utils/SnakeCase'
import { default as pluralize } from 'pluralize'

/**
 * Controller decorator
 * @param controllerName controller's name
 * @param params controller's params
 * @param params.repository optional repository used for default routes
 * @returns
 */
export const Controller =
  <T extends { new (...args: any[]): any }>(params: ControllerParams = {}) =>
  (constructor: T) => {
    const { name } = constructor
    const instance = new constructor()
    const routeName = params.overrideRouteName
      ? params.overrideRouteName
      : pluralize.plural(toSnakeCase(name.replace('Controller', '')))

    MetadataManager.setControllerMetadata(name, { path: `/${routeName}`, instance })
    const defaultRouteBuilder = new DefaultRouteBuilder(name, params.repository)
    const defaultActionsRoutes: string[] = Object.values(DefaultActions)
    const defaultActions = Object.getOwnPropertyNames(constructor.prototype)
      .filter(routeName => defaultActionsRoutes.includes(routeName))
      .forEach((routeName: DefaultActions) => {
        //MetadataManager.setRouteMetadata(name, routeName, {})
        if (params.repository) defaultRouteBuilder.registerDefaultRouteMetadata(routeName)
        else throw Error('need repository in controller params')
      })

    const routes = MetadataManager.getRoutesMetadata(name)
    // We must bind all methods to be able to use the context of controller ("this") in it
    const metadataRoutes: Array<RouteMetadata> = Object.values(routes) as RouteMetadata[]
    metadataRoutes.map(metadata => {
      metadata.handler = metadata.handler.bind(instance)
    })
  }

/**
 * controller params
 */
export interface ControllerParams {
  repository?: BuboRepository<unknown>
  overrideRouteName?: string
}

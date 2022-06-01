import { DefaultRouteBuilder } from '../../builder'
import { DefaultActions } from '../../interfaces'
import { MetadataManager } from '../../MetadataManager'

/**
 * Controller decorator
 * @param controllerName controller's name
 * @param params controller's params
 * @returns
 */
export const Controller =
  <T extends { new (...args: any[]): any }>(controllerName: string, params: ControllerParams = {}) =>
  (constructor: T) => {
    const { name } = constructor

    MetadataManager.setControllerMetadata(name, { path: `/${controllerName}` })
    const defaultRouteBuilder = new DefaultRouteBuilder(name)
    const defaultActionsRoutes: string[] = Object.values(DefaultActions)
    const defaultActions = Object.getOwnPropertyNames(constructor.prototype)
      .filter(routeName => defaultActionsRoutes.includes(routeName))
      .forEach((routeName: DefaultActions) => {
        //MetadataManager.setRouteMetadata(name, routeName, {})
        defaultRouteBuilder.registerDefaultRouteMetadata(routeName)
      })
  }

/**
 * controller params
 */
export interface ControllerParams {}

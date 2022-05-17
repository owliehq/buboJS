import { app } from '../..'
import { RouteMethod } from '../../enums'
import { RouteMetadata } from '../../interfaces'
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
    const CurrentControllerClass: any = class extends constructor {
      public static router = undefined
      public static controllerName = controllerName
      public static path = `/${controllerName}`

      // public static instance = new constructor();
    }

    const { name } = constructor

    //const controllerMetadata = MetadataManager.getControllerMetadata(name)
    MetadataManager.setControllerMetadata(name, { path: `/${controllerName}` })
    //const routes = generateRoutes(controllerMetadata.routes)
    // CurrentControllerClass.router = routes

    //app.registerController(CurrentControllerClass)

    return CurrentControllerClass
  }

function generateRoutes(routesMetadata: { [id: string]: RouteMetadata }): any {
  const router = app.server.initRouter()
  Object.entries(routesMetadata).map(([key, routeMetadata]) => {
    if (routeMetadata.method === RouteMethod.GET) router.get(routeMetadata.path, routeMetadata.handler)

    if (routeMetadata.method === RouteMethod.POST) router.post(routeMetadata.path, routeMetadata.handler)

    if (routeMetadata.method === RouteMethod.PUT) router.put(routeMetadata.path, routeMetadata.handler)

    if (routeMetadata.method === RouteMethod.PATCH) router.patch(routeMetadata.path, routeMetadata.handler)

    if (routeMetadata.method === RouteMethod.DELETE) router.delete(routeMetadata.path, routeMetadata.handler)
  })
  return router
}

/**
 * controller params
 */
export interface ControllerParams {}

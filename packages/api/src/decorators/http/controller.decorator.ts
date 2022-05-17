import { App } from '@tinyhttp/app'
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

    const controllerMetadata = MetadataManager.getControllerMetadata(name)
    const routes = generateRoutes(controllerMetadata.routes)
    CurrentControllerClass.router = routes

    app.registerController(CurrentControllerClass)

    return CurrentControllerClass
  }

function generateRoutes(routesMetadata: { [id: string]: RouteMetadata }): App {
  const router = new App()
  // TODO use json by default but we need to manage other type like urlencoded... Check milliparsec documentation
  Object.entries(routesMetadata).map(([key, routeMetadata]) => {
    console.log('routeMetadata.bodyFormat', routeMetadata.bodyFormat)
    // router.use(routeMetadata.path, routeMetadata.bodyFormat)

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

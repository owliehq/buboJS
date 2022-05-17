import { getProperty, setProperty } from 'dot-prop'
import { ControllerMetadata, ListMetadata, RouteMetadata } from './interfaces'

/**
 * Metadata Manager save metadata of controllers and routes
 */
export class MetadataManager {
  public static meta: ListMetadata = { controllers: {} }

  public static setControllerMetadata(controllerName: string, controllerMetadata: any): void {
    setProperty(
      this.meta,
      `controllers.${controllerName}`,
      Object.assign({ routes: {} }, getProperty(this.meta, `controllers.${controllerName}`), controllerMetadata)
    )
  }

  public static getControllerMetadata(controllerName: string): ControllerMetadata {
    return getProperty(this.meta, `controllers.${controllerName}`)
  }

  public static setRouteMetadata(controllerName: string, routeName: string, routeMetadata: RouteMetadata): void {
    setProperty(
      this.meta,
      `controllers.${controllerName}.routes.${routeName}`,
      Object.assign({}, getProperty(this.meta, `controllers.${controllerName}.routes.${routeName}`), routeMetadata)
    )
  }

  public static getRoutesMetadata(controllerName: string, routeName: string): RouteMetadata {
    return getProperty(this.meta, `controllers.${controllerName}.routes.${routeName}`)
  }
}

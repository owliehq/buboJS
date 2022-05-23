import { getProperty, setProperty } from 'dot-prop'
import {
  ControllerMetadata,
  ListMetadata,
  RouteMetadata,
  ParameterMetadata,
  MiddlewareMetadata,
  MiddlewarePosition
} from './interfaces'

/**
 * Metadata Manager save metadata of controllers and routes
 */
export class MetadataManager {
  // Root of all metadata of the app
  public static meta: ListMetadata = { controllers: {} }

  /**
   * Set metadata of the controller
   * @param controllerName name of the controller
   * @param controllerMetadata the metadata of the controller
   */
  public static setControllerMetadata(controllerName: string, controllerMetadata: any): void {
    const pathControllerMetadata = `controllers.${controllerName}`
    setProperty(
      this.meta,
      pathControllerMetadata,
      Object.assign({ routes: {} }, getProperty(this.meta, pathControllerMetadata), controllerMetadata)
    )
  }

  /**
   * Get metadata of the controller
   * @param controllerName name of the controller
   * @returns the metadata of the controller
   */
  public static getControllerMetadata(controllerName: string): ControllerMetadata {
    return getProperty(this.meta, `controllers.${controllerName}`)
  }

  /**
   * Set metadata of the route of the controller
   * @param controllerName name of the controller
   * @param routeName name of the route
   * @param routeMetadata the metadata of the route
   */
  public static setRouteMetadata(controllerName: string, routeName: string, routeMetadata: RouteMetadata): void {
    const pathRouteMetadata = `controllers.${controllerName}.routes.${routeName}`
    setProperty(
      this.meta,
      pathRouteMetadata,
      Object.assign({}, getProperty(this.meta, pathRouteMetadata), routeMetadata)
    )
  }

  /**
   * Get metadata of the route of the controller
   * @param controllerName name of the controller
   * @param routeName name of the route
   * @returns The metadata of the route
   */
  public static getRouteMetadata(controllerName: string, routeName: string): RouteMetadata {
    return getProperty(this.meta, `controllers.${controllerName}.routes.${routeName}`)
  }

  /**
   * Set the parameters according to the route of the controller
   * @param controllerName name of the controller
   * @param routeName name of the route
   * @param index index of the parameter
   * @param value the value of the parameter
   */
  public static setParameterMetadata(
    controllerName: string,
    routeName: string,
    index: number,
    value: ParameterMetadata
  ): void {
    const pathParameterMetadata = `controllers.${controllerName}.routes.${routeName}.parameters.${index}`
    setProperty(
      this.meta,
      pathParameterMetadata,
      Object.assign({}, getProperty(this.meta, pathParameterMetadata), value)
    )
  }

  /**
   * Get the parameters according to the route of the controller
   * @param controllerName name of the controller
   * @param routeName name of the route
   * @returns List of parameters
   */
  public static getParametersMetadata(controllerName: string, routeName: string): ParameterMetadata[] {
    return getProperty(this.meta, `controllers.${controllerName}.routes.${routeName}.parameters`)
  }

  /**
   * Set middlewares according to the route of the controller
   * @param position before or after the method handler
   * @param controllerName name of the controller
   * @param routeName name of the route
   * @param value the middleware to register
   */
  public static setMiddlewareMetadata(
    position: MiddlewarePosition,
    controllerName: string,
    routeName: string,
    value: MiddlewareMetadata
  ): void {
    const pathMiddlewareMetadata = `controllers.${controllerName}.routes.${routeName}.middlewares.${position}`
    const registratedMiddlewares: MiddlewareMetadata[] = getProperty(this.meta, pathMiddlewareMetadata)
    if (!registratedMiddlewares) {
      setProperty(this.meta, pathMiddlewareMetadata, [value])
    } else {
      registratedMiddlewares.unshift(value)
      setProperty(this.meta, pathMiddlewareMetadata, registratedMiddlewares)
    }
  }

  /**
   * Get middlewares according to the route of the controller
   * @param position before or after the method handler
   * @param controllerName name of the controller
   * @param routeName name of the route
   * @returns List of middlewares
   */
  public static getMiddlewaresMetadata(
    position: MiddlewarePosition,
    controllerName: string,
    routeName: string
  ): MiddlewareMetadata[] {
    return getProperty(this.meta, `controllers.${controllerName}.routes.${routeName}.middlewares.${position}`)
  }
}

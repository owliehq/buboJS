import { getProperty, setProperty } from 'dot-prop'
import {
  ControllerMetadata,
  ListMetadata,
  RouteMetadata,
  ParameterMetadata,
  MiddlewareMetadata,
  MiddlewarePosition,
  Class
} from './interfaces'

/**
 * Metadata Manager save metadata of controllers and routes
 */
export class MetadataManager {
  // Root of all metadata of the app
  public static meta: ListMetadata = { controllers: {}, services: {}, injections: {} }

  /**
   * Set metadata of the controller
   * @param controllerName name of the controller
   * @param controllerMetadata the metadata of the controller
   */
  public static setControllerMetadata(controllerName: string, controllerMetadata: ControllerMetadata): void {
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
   * Get metadata of all routes of the controller
   * @param controllerName name of the controller
   * @returns The metadata of all routes
   */
  public static getRoutesMetadata(controllerName: string): RouteMetadata {
    return getProperty(this.meta, `controllers.${controllerName}.routes`)
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
   * @param controllerName name of the controller
   * @param routeName name of the route
   * @param position before or after the method handler
   * @param value the middleware to register
   */
  public static setMiddlewareMetadata(
    controllerName: string,
    routeName: string,
    position: MiddlewarePosition,
    value: MiddlewareMetadata
  ): void {
    const pathMiddlewareMetadata = `controllers.${controllerName}.routes.${routeName}.middlewares.${position}`
    const registratedMiddlewares: MiddlewareMetadata[] = getProperty(this.meta, pathMiddlewareMetadata)
    if (!registratedMiddlewares) {
      setProperty(this.meta, pathMiddlewareMetadata, [value])
    } else {
      // TODO check if unshift is needed instead of push
      registratedMiddlewares.push(value)
      setProperty(this.meta, pathMiddlewareMetadata, registratedMiddlewares)
    }
  }

  /**
   * Get middlewares according to the route of the controller
   * @param controllerName name of the controller
   * @param routeName name of the route
   * @param position before or after the method handler
   * @returns List of middlewares
   */
  public static getMiddlewaresMetadata(
    controllerName: string,
    routeName: string,
    position: MiddlewarePosition
  ): MiddlewareMetadata[] {
    return getProperty(this.meta, `controllers.${controllerName}.routes.${routeName}.middlewares.${position}`)
  }

  /**
   * Set metadata of the service
   * @param serviceName name of the service
   * @param serviceMetadata the metadata of the service
   */
  public static setServiceMetadata(serviceName: string, serviceMetadata: any): void {
    const pathServiceMetadata = `services.${serviceName}`
    setProperty(this.meta, pathServiceMetadata, serviceMetadata)
  }

  /**
   * Get metadata of the service
   * @param serviceName name of the service
   * @returns the metadata of the service
   */
  public static getServiceMetadata<T>(serviceName: string | Class<T>): T {
    const name = typeof serviceName === 'string' ? serviceName : serviceName.name
    return getProperty(this.meta, `services.${name}`)
  }

  /**
   * Set one link between the parent class and service which need to be injected
   * @param parentName name of the parent which contains injection
   * @param serviceName the service name
   */
  public static setInjectionMetadata(parentName: string, serviceName: string, className: string): void {
    const pathServiceMetadata = `injections.${parentName}.services.${serviceName}`
    setProperty(this.meta, pathServiceMetadata, className)
  }

  /**
   * get link between the parent class and service wich need to be injected
   * @param parentName name of the parent wich contains injection
   * @param serviceName the service name
   */
  public static getInjectionMetadata(parentName: string, serviceName: string): any {
    return getProperty(this.meta, `injections.${parentName}.services.${serviceName}`)
  }

  /**
   * Get all injections metadata
   * @returns the metadata of the service
   */
  public static getInjectionMetadatas(): any {
    return getProperty(this.meta, `injections`)
  }
}

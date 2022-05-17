import { getProperty, setProperty } from 'dot-prop'
import { ControllerMetadata, ListMetadata, RouteMetadata, ParameterMetadata } from './interfaces'

/**
 * Metadata Manager save metadata of controllers and routes
 */
export class MetadataManager {
  public static meta: ListMetadata = { controllers: {} }

  public static setControllerMetadata(controllerName: string, controllerMetadata: any): void {
    const pathControllerMetadata = `controllers.${controllerName}`
    setProperty(
      this.meta,
      pathControllerMetadata,
      Object.assign({ routes: {} }, getProperty(this.meta, pathControllerMetadata), controllerMetadata)
    )
  }

  public static getControllerMetadata(controllerName: string): ControllerMetadata {
    return getProperty(this.meta, `controllers.${controllerName}`)
  }

  public static setRouteMetadata(controllerName: string, routeName: string, routeMetadata: RouteMetadata): void {
    const pathRouteMetadata = `controllers.${controllerName}.routes.${routeName}`
    setProperty(
      this.meta,
      pathRouteMetadata,
      Object.assign({}, getProperty(this.meta, pathRouteMetadata), routeMetadata)
    )
  }

  public static getRoutesMetadata(controllerName: string, routeName: string): RouteMetadata {
    return getProperty(this.meta, `controllers.${controllerName}.routes.${routeName}`)
  }

  public static setParametersMetadata(
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

  public static getParametersMetadata(controllerName: string, routeName: string): ParameterMetadata[] {
    return getProperty(this.meta, `controllers.${controllerName}.routes.${routeName}.parameters`)
  }
}

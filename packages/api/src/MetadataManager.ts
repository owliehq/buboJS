import { getProperty, setProperty } from 'dot-prop';
import { ControllerMetadata, ListMetadata, RouteMetadata } from './interfaces';

/**
 * Metadata Manager save metadata of controllers and routes
 */
export class MetadataManager {
  public static meta: ListMetadata = { controllers: [] };

  public static setControllerMetadata(controllerName: string): void {
    this.meta.controllers[controllerName] = this.meta.controllers[
      controllerName
    ] || { routes: [] };
  }

  public static getControllerMetadata(
    controllerName: string
  ): ControllerMetadata {
    return this.meta.controllers[controllerName];
  }

  public static SetRouteMetadata(
    controllerName: string,
    routeName: string,
    value: RouteMetadata
  ): void {
    this.setControllerMetadata(controllerName);
    setProperty(
      this.meta,
      `controllers.${controllerName}.routes.${routeName}`,
      value
    );
  }

  public static getRoutesMetadata(
    controllerName: string,
    routeName: string
  ): RouteMetadata {
    return getProperty(
      this.meta,
      `controllers.${controllerName}.routes.${routeName}`
    );
  }
}

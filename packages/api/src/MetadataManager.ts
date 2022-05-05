import { ListMetadata, RouteMethod } from './interfaces';

export class MetadataManager {
  public static meta: ListMetadata = { controllers: [] };

  public static registerController(controllerName: string) {
    MetadataManager.meta.controllers[controllerName] =
      MetadataManager.meta.controllers[controllerName] || {};
  }

  public static getControllerMetadata(controllerName: string) {
    return MetadataManager.meta.controllers[controllerName];
  }

  //set controllerMetadata
  //set routeControllerMetadata
  //reflechir si creation du handler dans methods.decorator.ts ou dans un routesResolver qui passera dans chaque routes d'un controller par la suite
}

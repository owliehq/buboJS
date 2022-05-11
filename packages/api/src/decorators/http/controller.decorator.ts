import { MetadataManager } from '../../MetadataManager';

/**
 * Controller decorator
 * @param controllerName controller's name
 * @param params controller's params
 * @returns
 */
export const Controller =
  <T extends { new (...args: any[]): any }>(
    controllerName: string,
    params: ControllerParams = {}
  ) =>
  (constructor: T) => {
    const currentControllerClass: any = class extends constructor {
      public static controllerName = controllerName;
      public static path = `/${controllerName}`;

      // public static instance = new constructor();
    };

    const { name } = constructor;
    MetadataManager.setControllerMetadata(name);

    //generate routes that depend of fastify or tinyhttp

    //register right controller

    return currentControllerClass;
  };

/**
 * controller params
 */
export interface ControllerParams {}

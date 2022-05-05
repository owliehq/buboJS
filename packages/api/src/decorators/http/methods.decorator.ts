import { RouteMethod } from '../../interfaces';

/**
 * build method of route decorators
 * it save the route method metadata
 * @param method
 * @returns
 */
const buildMethod =
  (method: RouteMethod) =>
  (subRoute: string = '/') =>
  (target: any, propertyKey: string, descriptor: PropertyDescriptor): any => {
    console.log('target', target);
    console.log('propertyKey', propertyKey);
    console.log('descriptor', descriptor);
    //save into metadataManager metadataManager.meta.controller[idController].routes[idRoute] faire une route dans metadataManager saveRoute ou saveMetadata(Route|Controller)
  };

/**
 * decorator that generate custom GET route
 */
export const Get = buildMethod(RouteMethod.GET);
/**
 * decorator that generate custom POST route
 */
export const Post = buildMethod(RouteMethod.POST);
/**
 * decorator that generate custom PUT route
 */
export const Put = buildMethod(RouteMethod.PUT);
/**
 * decorator that generate custom PATCH route
 */
export const Patch = buildMethod(RouteMethod.PATCH);
/**
 * decorator that generate custom DELETE route
 */
export const Delete = buildMethod(RouteMethod.DELETE);

export interface MethodOptions {}

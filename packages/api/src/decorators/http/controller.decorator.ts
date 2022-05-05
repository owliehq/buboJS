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
    //save into metadataManager
    //generate routes
  };

/**
 * controller params
 */
export interface ControllerParams {}

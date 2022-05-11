import { RouteMethod } from '../enums';

export interface RouteMetadata {
  path: string;
  method: RouteMethod;
  handler: (this: any, req: any, res: any) => any;
}

export interface ListMetadata {
  controllers: ControllerMetadata[];
}

export interface ControllerMetadata {
  routes: RouteMetadata[];
  path: string;
}

export enum RouteMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export interface RouteMetadata {
  path: string;
  method: RouteMethod;
}

export interface ListMetadata {
  controllers: ControllerMetadata[];
}

export interface ControllerMetadata {
  routes: RouteMetadata[];
}

import { RouteMethod } from '../enums'

export interface RouteMetadata {
  path: string
  method: RouteMethod
  handler: (this: any, req: any, res: any) => any
}

export interface ListMetadata {
  controllers: { [id: string]: ControllerMetadata }
}

export interface ControllerMetadata {
  routes: { [id: string]: RouteMetadata }
  path: string
}

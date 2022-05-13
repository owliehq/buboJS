import { RouteMethod } from '../enums'

export interface RouteMetadata {
  path: string
  method: RouteMethod
  parameters: ParameterMetadata[]
  handler: (this: any, req: any, res: any) => any
}

export interface ListMetadata {
  controllers: { [id: string]: ControllerMetadata }
}

export interface ControllerMetadata {
  routes: { [id: string]: RouteMetadata }
  parameters: { [id: string]: ParameterMetadata }
}

export interface ParameterMetadata {
  getValue: Function
}

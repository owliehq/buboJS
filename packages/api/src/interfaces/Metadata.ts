import { RouteMethod } from '../enums'
import { BodyFormat } from './DecoratorOptions'

export interface RouteMetadata {
  path: string
  method: RouteMethod
  parameters: ParameterMetadata[]
  bodyFormat?: BodyFormat
  handler: (this: any, req: any, res: any) => any
}

export interface ListMetadata {
  controllers: { [id: string]: ControllerMetadata }
}

export interface ControllerMetadata {
  routes: { [id: string]: RouteMetadata }
  path: string
  parameters: { [id: string]: ParameterMetadata }
}

export interface ParameterMetadata {
  getValue: Function
}

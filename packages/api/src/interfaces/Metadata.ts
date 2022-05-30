import { RouteMethod } from '../enums'
import { BodyFormat } from './DecoratorOptions'

export interface RouteMetadata {
  path: string
  method: RouteMethod
  parameters: ParameterMetadata[]
  bodyFormat?: BodyFormat
  beforeMiddlewares?: MiddlewareMetadata[]
  afterMiddlewares?: MiddlewareMetadata[]
  handler: (this: any, req: any, res: any) => any
}

export interface ListMetadata {
  controllers: { [id: string]: ControllerMetadata }
  services: { [id: string]: any }
  injections: { [id: string]: any }
}

export interface ControllerMetadata {
  routes?: { [id: string]: RouteMetadata }
  path: string
  instance: any
}

export interface ParameterMetadata {
  getValue: Function
}

export interface MiddlewareMetadata {
  (req: any, res: any, next: Function): void
}

export enum MiddlewarePosition {
  BEFORE = 'before',
  AFTER = 'after'
}

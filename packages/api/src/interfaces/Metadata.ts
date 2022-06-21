import { HeaderType, RouteMethod } from '../enums'
import { BodyFormat } from './DecoratorOptions'

export interface RouteMetadata {
  path: string
  method: RouteMethod
  parameters: ParameterMetadata[]
  bodyFormat?: BodyFormat
  middlewares?: Middlewares
  handler: (this: any, req: any, res: any, next: Function) => any
}

export interface ListMetadata {
  controllers: { [id: string]: ControllerMetadata }
  services: { [id: string]: any }
  injections: { [id: string]: any }
  modules: any[]
}

export interface ControllerMetadata {
  routes?: { [id: string]: RouteMetadata }
  path: string
  instance: any
}

export interface ParameterMetadata {
  getValue: Function
  name?: string
  headerType: HeaderType
}

export interface Middlewares {
  before?: MiddlewareMetadata[]
  after?: MiddlewareMetadata[]
}

export interface MiddlewareMetadata {
  (req: any, res: any, next: Function): void
}

export enum MiddlewarePosition {
  BEFORE = 'before',
  AFTER = 'after'
}

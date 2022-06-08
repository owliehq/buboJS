import { ControllerMetadata, RouteMetadata } from '@bubojs/api'
import { setProperty } from 'dot-prop'
import { InfoType, OpenApiJSONType, OperationType, PathType } from './interfaces'

export class DocBuilder {
  private openApiJSON: OpenApiJSONType
  private controllersMetadata: { [id: string]: ControllerMetadata }
  private modelsMetadata: void

  constructor() {
    this.openApiJSON = {
      openapi: '',
      info: { title: '', version: '' },
      paths: {}
    }
  }

  public registerInfo(info: InfoType): DocBuilder {
    this.openApiJSON.info = info
    return this
  }

  public registerControllers(controllersMetadata: { [id: string]: ControllerMetadata }): DocBuilder {
    this.controllersMetadata = controllersMetadata
    return this
  }

  public registerModels(): DocBuilder {
    return this
  }

  private createController(controllerMetadata: ControllerMetadata) {
    const paths: PathType = {}

    const controllerPath = controllerMetadata.path
    const routes = controllerMetadata.routes

    Object.entries(routes).forEach(([key, routeMetadata]) => {
      this.createRoute(paths, controllerPath, routeMetadata)
    })

    this.openApiJSON.paths = paths
  }

  private createRoute(paths: PathType, path: string, routeMetadata: RouteMetadata) {
    const routePath = routeMetadata.path
    const method = routeMetadata.method
    const parameterMetadata = routeMetadata.parameters

    let config: OperationType = {
      responses: {
        '200': {
          description: 'OK',
          content: { 'application/json': {} }
        }
      }
    }

    setProperty(paths, `${path}${routePath}.${method.toLowerCase()}`, config)
  }

  public buildDoc(): OpenApiJSONType {
    this.openApiJSON.openapi = '3.0.3'
    Object.entries(this.controllersMetadata).forEach(([key, controllerMetadata]) => {
      this.createController(controllerMetadata)
    })
    return this.openApiJSON
  }
}

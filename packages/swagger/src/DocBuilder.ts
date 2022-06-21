import { ControllerMetadata, HeaderType, ParameterMetadata, RouteMetadata } from '@bubojs/api'
import { setProperty } from 'dot-prop'
import { InfoType, OpenApiJSONType, OperationType, ParameterType, PathType, RouteOptions } from './interfaces'

export class DocBuilder {
  private openApiJSON: OpenApiJSONType
  private controllersMetadata: { [id: string]: ControllerMetadata }

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

  public createController(controllerMetadata: ControllerMetadata) {
    const paths: PathType = {}

    const controllerPath = controllerMetadata.path
    const routes = controllerMetadata.routes

    Object.entries(routes).forEach(([key, routeMetadata]) => {
      const routePath = routeMetadata.path
      const method = routeMetadata.method
      setProperty(
        paths,
        `${controllerPath}${routePath}.${method.toLowerCase()}`,
        this.createRoute(routeMetadata, { tag: controllerMetadata.path.slice(1) })
      )
    })

    this.openApiJSON.paths = paths
  }

  public createRoute(routeMetadata: RouteMetadata, { tag }: RouteOptions) {
    const parameterMetadata = routeMetadata.parameters
    const parameters = parameterMetadata
      ? Object.entries(parameterMetadata)
          .map(([key, parameterMetadata]) => this.createParameter(parameterMetadata))
          .filter(parameterType => parameterType)
      : []

    let config: OperationType = {
      parameters,
      responses: {
        '200': {
          description: 'OK',
          content: { 'application/json': {} }
        }
      },
      tags: [tag]
    }

    return config
  }

  public createParameter(parameterMetadata: ParameterMetadata): ParameterType {
    const inValues = {
      [HeaderType.QUERY]: 'query',
      [HeaderType.HEADER]: 'header',
      [HeaderType.PARAM]: 'path',
      COOKIE: 'cookie'
    } as const
    if (
      (parameterMetadata.headerType === HeaderType.PARAM ||
        parameterMetadata.headerType === HeaderType.QUERY ||
        parameterMetadata.headerType === HeaderType.HEADER) &&
      parameterMetadata.name
    )
      return {
        in: inValues[parameterMetadata.headerType],
        name: parameterMetadata.name
      }
  }

  public buildDoc(): OpenApiJSONType {
    this.openApiJSON.openapi = '3.0.3'
    Object.entries(this.controllersMetadata).forEach(([key, controllerMetadata]) => {
      this.createController(controllerMetadata)
    })
    return this.openApiJSON
  }
}

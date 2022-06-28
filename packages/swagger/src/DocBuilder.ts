import {
  ColumnMetadata,
  ControllerMetadata,
  HeaderType,
  ModelMetadata,
  ParameterMetadata,
  RouteMetadata
} from '@bubojs/api'
import { setProperty } from 'dot-prop'
import { SequelizeTypeToDefaultType } from './converters'
import { InfoType, OpenApiJSONType, OperationType, ParameterType, RouteOptions, SchemaType } from './interfaces'

export class DocBuilder {
  private openApiJSON: OpenApiJSONType
  private controllersMetadata: { [id: string]: ControllerMetadata }
  private modelsMetadata: { [id: string]: ModelMetadata }

  constructor() {
    this.openApiJSON = {
      openapi: '',
      info: { title: '', version: '' },
      paths: {},
      components: { schemas: {} }
    }
  }

  /**
   * register open api infos
   * @param info
   */
  public registerInfo(info: InfoType): DocBuilder {
    this.openApiJSON.info = info
    return this
  }

  /**
   * register controller metadata
   * @param controllersMetadata
   */
  public registerControllers(controllersMetadata: { [id: string]: ControllerMetadata }): DocBuilder {
    this.controllersMetadata = controllersMetadata
    return this
  }

  /**
   * register model metadata
   * @param modelsMetadata
   */
  public registerModels(modelsMetadata: { [id: string]: ModelMetadata }): DocBuilder {
    this.modelsMetadata = modelsMetadata
    return this
  }

  /**
   * create controller from controllerMetadata
   * @param controllerMetadata
   */
  public createController(controllerMetadata: ControllerMetadata) {
    const controllerPath = controllerMetadata.path
    const routes = controllerMetadata.routes

    Object.entries(routes).forEach(([key, routeMetadata]) => {
      const routePath = routeMetadata.path
      const method = routeMetadata.method
      setProperty(
        this.openApiJSON.paths,
        `${controllerPath}${routePath}.${method.toLowerCase()}`,
        this.createRoute(routeMetadata, { tag: controllerMetadata.path.slice(1) })
      )
    })
  }

  /**
   * create route in openAPI format from routeMetadata
   * @param routeMetadata routeMetadata
   * @param options options to add some infos
   * @param options.tag tag of route that can be used to regroup same tagged routes
   * @returns
   */
  public createRoute(routeMetadata: RouteMetadata, options: RouteOptions) {
    const parameterMetadata = routeMetadata.parameters
    const { tag } = options
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

  /**
   * create parameter in openAPI format from parameter metadata
   * @param parameterMetadata
   * @returns
   */
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

  /**
   * create model in openAPI format from model metadata
   * @param modelMetadata
   */
  public createModel(modelMetadata: ModelMetadata) {
    const columns = modelMetadata.columns
    const properties = {}
    Object.entries(columns).forEach(([key, columnMetadata]) => {
      setProperty(properties, key, this.createColumn(columnMetadata))
    })

    setProperty(this.openApiJSON.components.schemas, modelMetadata.name, { type: 'object', properties })
  }

  /**
   * create column in openAPI format from columnMetadata
   * @param columnMetadata
   */
  public createColumn(columnMetadata: ColumnMetadata): SchemaType {
    return { type: SequelizeTypeToDefaultType.convert(columnMetadata.type) }
  }

  /**
   * build the doc
   */
  public buildDoc(): OpenApiJSONType {
    this.openApiJSON.openapi = '3.0.3'
    Object.entries(this.modelsMetadata).forEach(([key, modelMetadata]) => {
      this.createModel(modelMetadata)
    })
    Object.entries(this.controllersMetadata).forEach(([key, controllerMetadata]) => {
      this.createController(controllerMetadata)
    })
    return this.openApiJSON
  }
}

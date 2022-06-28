import { RouteMethod } from '../enums'
import { BodyFormat, DefaultActions, RouteMetadata } from '../interfaces'
import { MetadataManager } from '../MetadataManager'
import { BuboRepository } from '../models'

/**
 * regroup building of default routes into metadata manager
 */
export class DefaultRouteBuilder {
  constructor(private controllerName: string, private repository?: BuboRepository<any>) {}

  /**
   * register route depending of routeName
   * @param routeName routename of default actions
   */
  public registerDefaultRouteMetadata(routeName: DefaultActions) {
    switch (routeName) {
      case DefaultActions.GET_ONE:
        this.registerGetOneRoute()
        break
      case DefaultActions.GET_MANY:
        this.registerGetManyRoute()
        break
      case DefaultActions.CREATE_ONE:
        this.registerCreateOneRoute()
        break
      case DefaultActions.UPDATE_ONE:
        this.registerUpdateOneRoute()
        break
      case DefaultActions.DELETE_ONE:
        this.registerDeleteOneRoute()
        break
    }
  }

  private createWrapper = (handler: Function) => {
    return async function (this: any, req: any, res: any, next: Function) {
      req.result = await handler(req, res, next)
      next()
    }
  }

  /**
   * register GET_ONE route into metadata manager
   */
  private registerGetOneRoute() {
    const metadata: RouteMetadata = {
      path: '/:id',
      method: RouteMethod.GET,
      handler: this.createWrapper(async (req: any, res: any, next: Function) => {
        const { params } = req
        return this.repository.findById(params.id)
      }),
      parameters: []
    }
    MetadataManager.setRouteMetadata(this.controllerName, DefaultActions.GET_ONE, metadata)
  }

  /**
   * register GET_MANY route into metadata manager
   */
  private registerGetManyRoute() {
    const metadata: RouteMetadata = {
      path: '/',
      method: RouteMethod.GET,
      handler: this.createWrapper(async (req: any, res: any, next: Function) => {
        return this.repository.findAll()
      }),
      parameters: []
    }
    MetadataManager.setRouteMetadata(this.controllerName, DefaultActions.GET_MANY, metadata)
  }

  /**
   * register CREATE_ONE route into metadata manager
   */
  private registerCreateOneRoute() {
    const metadata: RouteMetadata = {
      path: '/',
      method: RouteMethod.POST,
      handler: this.createWrapper((req: any, res: any, next: Function) => {
        return this.repository.create(req.body)
      }),
      parameters: [],
      bodyFormat: BodyFormat.JSON
    }
    MetadataManager.setRouteMetadata(this.controllerName, DefaultActions.CREATE_ONE, metadata)
  }

  private registerUpdateOneRoute() {
    const metadata: RouteMetadata = {
      path: '/:id',
      method: RouteMethod.PUT,
      handler: this.createWrapper((req: any, res: any, next: Function) => {
        const { params, body } = req
        return this.repository.update(params.id, body)
      }),
      parameters: [],
      bodyFormat: BodyFormat.JSON
    }
    MetadataManager.setRouteMetadata(this.controllerName, DefaultActions.UPDATE_ONE, metadata)
  }

  /**
   * register DELETE_ONE route into metadata manager
   */
  private registerDeleteOneRoute() {
    const metadata: RouteMetadata = {
      path: '/:id',
      method: RouteMethod.DELETE,
      handler: this.createWrapper((req: any, res: any, next: Function) => {
        const { params } = req
        return this.repository.delete(params.id)
      }),
      parameters: []
    }
    MetadataManager.setRouteMetadata(this.controllerName, DefaultActions.DELETE_ONE, metadata)
  }
}

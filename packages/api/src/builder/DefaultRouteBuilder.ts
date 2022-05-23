import { RouteMethod } from '../enums'
import { BodyFormat, DefaultActions, RouteMetadata } from '../interfaces'
import { MetadataManager } from '../MetadataManager'

/**
 * regroup building of default routes into metadata manager
 */
export class DefaultRouteBuilder {
  constructor(private controllerName: string) {}

  /**
   * register route depending of routeName
   * @param routeName
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
      case DefaultActions.DELETE_ONE:
        this.registerDeleteOneRoute()
        break
    }
  }

  /**
   * register GET_ONE route into metadata manager
   */
  private registerGetOneRoute() {
    const metadata: RouteMetadata = {
      path: '/:id',
      method: RouteMethod.GET,
      handler: async function (this: any, req: any, res: any) {
        //findById
        // return findById
        return { id: 1, model: 'voiture' }
      },
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
      handler: async function (this: any, req: any, res: any) {
        //find
        // return find
        return [{ id: 1, model: 'voiture' }]
      },
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
      handler: async function (this: any, req: any, res: any) {
        // create
        // return create
        return { id: 2, model: 'car' }
      },
      parameters: []
    }
    MetadataManager.setRouteMetadata(this.controllerName, DefaultActions.CREATE_ONE, metadata)
  }

  /**
   * register DELETE_ONE route into metadata manager
   */
  private registerDeleteOneRoute() {
    const metadata: RouteMetadata = {
      path: '/:id',
      method: RouteMethod.DELETE,
      handler: async function (this: any, req: any, res: any) {
        //delete
        return { message: 'deleted' }
      },
      parameters: []
    }
    MetadataManager.setRouteMetadata(this.controllerName, DefaultActions.DELETE_ONE, metadata)
  }
}

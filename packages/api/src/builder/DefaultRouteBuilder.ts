import { RouteMethod } from '../enums'
import { BodyFormat, DefaultActions, RouteMetadata } from '../interfaces'
import { MetadataManager } from '../MetadataManager'

export class DefaultRouteBuilder {
  constructor(private controllerName: string) {}

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

  private registerGetOneRoute() {
    const metadata: RouteMetadata = {
      path: '/:id',
      method: RouteMethod.GET,
      beforeMiddlewares: [],
      afterMiddlewares: [],
      handler: async (req, res) => {
        //findById
        // return findById
        return { id: 1, model: 'voiture' }
      },
      parameters: []
    }
    MetadataManager.setRouteMetadata(this.controllerName, DefaultActions.GET_ONE, metadata)
  }

  private registerGetManyRoute() {
    const metadata: RouteMetadata = {
      path: '/',
      method: RouteMethod.GET,
      beforeMiddlewares: [],
      afterMiddlewares: [],
      handler: async (req, res) => {
        //find
        // return find
        return [{ id: 1, model: 'voiture' }]
      },
      parameters: []
    }
    MetadataManager.setRouteMetadata(this.controllerName, DefaultActions.GET_MANY, metadata)
  }

  private registerCreateOneRoute() {
    const metadata: RouteMetadata = {
      path: '/',
      method: RouteMethod.POST,
      beforeMiddlewares: [],
      afterMiddlewares: [],
      handler: async (req, res) => {
        // create
        // return create
        return { id: 2, model: 'car' }
      },
      parameters: []
    }
    MetadataManager.setRouteMetadata(this.controllerName, DefaultActions.CREATE_ONE, metadata)
  }

  private registerDeleteOneRoute() {
    const metadata: RouteMetadata = {
      path: '/:id',
      method: RouteMethod.DELETE,
      beforeMiddlewares: [],
      afterMiddlewares: [],
      handler: async (req, res) => {
        //delete
        return { message: 'deleted' }
      },
      parameters: []
    }
    MetadataManager.setRouteMetadata(this.controllerName, DefaultActions.DELETE_ONE, metadata)
  }
}

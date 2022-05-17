import { AdapterHttpModule } from './adapters'
import { RouteMethod } from './enums'
import { ListMetadata } from './interfaces'

/**
 * http resolver
 */
export class HttpResolver {
  constructor(private httpAdapter: AdapterHttpModule<any>) {}

  /**
   * resolve controller metadata to inject routes on sub router
   * @param metadatas
   */
  public controllerRevolve(metadatas: ListMetadata) {
    Object.entries(metadatas.controllers).map(([key, controllerMetadata]) => {
      const router = this.httpAdapter.initRouter()
      Object.entries(controllerMetadata.routes).map(([key, routeMetadata]) => {
        if (routeMetadata.method === RouteMethod.GET) router.get(routeMetadata.path, routeMetadata.handler)

        if (routeMetadata.method === RouteMethod.POST) router.post(routeMetadata.path, routeMetadata.handler)

        if (routeMetadata.method === RouteMethod.PUT) router.put(routeMetadata.path, routeMetadata.handler)

        if (routeMetadata.method === RouteMethod.PATCH) router.patch(routeMetadata.path, routeMetadata.handler)

        if (routeMetadata.method === RouteMethod.DELETE) router.delete(routeMetadata.path, routeMetadata.handler)
      })

      this.httpAdapter.use(controllerMetadata.path, router)
    })
  }
}

import { AdapterHttpModule } from './adapters'
import { RouteMethod } from './enums'
import { ListMetadata, MiddlewarePosition } from './interfaces'
import { MetadataManager } from './MetadataManager'

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
    Object.entries(metadatas.controllers).map(([controllerKey, controllerMetadata]) => {
      const router = this.httpAdapter.initRouter()
      Object.entries(controllerMetadata.routes).map(([routeKey, routeMetadata]) => {
        const beforeMiddlewares = MetadataManager.getMiddlewaresMetadata(
          MiddlewarePosition.BEFORE,
          controllerKey,
          routeKey
        )
        const afterMiddlewares = MetadataManager.getMiddlewaresMetadata(
          MiddlewarePosition.AFTER,
          controllerKey,
          routeKey
        )
        const { bodyFormat } = routeMetadata
        // router.useBodyFormat(routeMetadata.path, bodyFormat)
        if (routeMetadata.method === RouteMethod.GET)
          router.get(routeMetadata.path, beforeMiddlewares, routeMetadata.handler, afterMiddlewares)

        if (routeMetadata.method === RouteMethod.POST)
          router.post(routeMetadata.path, bodyFormat, beforeMiddlewares, routeMetadata.handler, afterMiddlewares)

        if (routeMetadata.method === RouteMethod.PUT)
          router.put(routeMetadata.path, bodyFormat, beforeMiddlewares, routeMetadata.handler, afterMiddlewares)

        if (routeMetadata.method === RouteMethod.PATCH)
          router.patch(routeMetadata.path, bodyFormat, beforeMiddlewares, routeMetadata.handler, afterMiddlewares)

        if (routeMetadata.method === RouteMethod.DELETE)
          router.delete(routeMetadata.path, bodyFormat, beforeMiddlewares, routeMetadata.handler, afterMiddlewares)
      })

      this.httpAdapter.use(controllerMetadata.path, router)
    })
  }
}

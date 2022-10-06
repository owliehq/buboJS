import { AdapterHttpModule } from './adapters'
import { RouteMethod } from './enums'
import { ListMetadata, MiddlewarePosition, RouteMetadata } from './interfaces'
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
      Object.entries(controllerMetadata.routes)
        .sort(comparePath)
        .map(([routeKey, routeMetadata]) => {
          const beforeMiddlewares = (
            MetadataManager.getMiddlewaresMetadata(controllerKey, routeKey, MiddlewarePosition.BEFORE) || []
          ).reverse()
          const afterMiddlewares = (
            MetadataManager.getMiddlewaresMetadata(controllerKey, routeKey, MiddlewarePosition.AFTER) || []
          ).reverse()
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

const comparePath = function (routeA: [string, RouteMetadata], routeB: [string, RouteMetadata]) {
  const splitA = routeA[1].path.split('/')
  const splitB = routeB[1].path.split('/')

  if (splitA.length > splitB.length) {
    return -1
  }
  if (splitA.length > splitB.length) {
    return 1
  }
  // length are equal, searching for a parameter field
  for (let i = 0; i < splitA.length; i++) {
    const aHasParam = splitA[i].includes(':')
    const bHasParam = splitB[i].includes(':')

    // a has a param and not b, a must be last
    if (aHasParam > bHasParam) {
      return 1
    }
    // b has a param and not a, b must be last
    if (aHasParam < bHasParam) {
      return -1
    }
  }
  return 0
}

import { ListMetadata } from './interfaces/index.js'
import { MetadataManager } from './MetadataManager.js'

export class ServiceResolver {
  public serviceResolve(metadatas: ListMetadata) {
    // for each injections
    Object.entries(metadatas.injections).map(([injectionKey, injectionMetadata]) => {
      const controller =
        MetadataManager.getControllerMetadata(injectionKey) || MetadataManager.getServiceMetadata(injectionKey)
      Object.entries(injectionMetadata.services).map(([serviceKey, serviceMetadata]) => {
        const service = MetadataManager.getServiceMetadata(serviceMetadata as string)
        // Set the service inside controller
        // TODO Refacto this
        if (controller.instance) controller.instance[serviceKey] = service
        else controller[serviceKey] = service
      })
    })
  }
}

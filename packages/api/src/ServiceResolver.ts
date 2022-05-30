import { AdapterHttpModule } from './adapters'
import { ListMetadata } from './interfaces'
import { MetadataManager } from './MetadataManager'

export class ServiceResolver {
  constructor(private httpAdapter: AdapterHttpModule<any>) {}

  public serviceResolve(metadatas: ListMetadata) {
    console.log('meta before', MetadataManager.meta)
    // for each controller
    Object.entries(metadatas.injections).map(([injectionKey, injectionMetadata]) => {
      // Get list of injection links
      const controller = MetadataManager.getControllerMetadata(injectionKey)
      Object.entries(injectionMetadata.services).map(([serviceKey, serviceMetadata]) => {
        const service = MetadataManager.getServiceMetadata(serviceMetadata as string)
        // Set the service inside controller
        controller.instance[serviceKey] = service
      })
    })

    // for each services
    Object.entries(metadatas.services).map(([injectionKey, injectionMetadata]) => {
      // Get list of injection links
      const serviceParent = MetadataManager.getServiceMetadata(injectionKey)
      Object.entries(injectionMetadata.services).map(([serviceKey, serviceMetadata]) => {
        const service = MetadataManager.getServiceMetadata(serviceMetadata as string)
        // Set the service inside service
        serviceParent.instance[serviceKey] = service
      })
    })

    console.log('meta after', MetadataManager.meta)
  }
}

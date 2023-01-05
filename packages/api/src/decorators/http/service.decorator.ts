import { MetadataManager } from '../../MetadataManager.js'

export const Service =
  <T extends { new (...args: any[]): any }>() =>
  (constructor: T) => {
    const { name } = constructor
    MetadataManager.setServiceMetadata(name, new constructor())
  }

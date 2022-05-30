import { MetadataManager } from '../../MetadataManager'

export const Service =
  <T extends { new (...args: any[]): any }>() =>
  (constructor: T) => {
    const { name } = constructor
    console.log('SERVICE', name)
    MetadataManager.setServiceMetadata(name, new constructor())
  }

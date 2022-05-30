import { MetadataManager } from '../../MetadataManager'
import 'reflect-metadata'

export function Inject(target: any, propertyName: string): void {
  // Get the type of the property injection
  var type = Reflect.getMetadata('design:type', target, propertyName)
  console.log(
    'INJECT',
    target.constructor.name,
    propertyName,
    propertyName.charAt(0).toUpperCase() + propertyName.slice(1)
  )
  MetadataManager.setInjectionMetadata(
    target.constructor.name,
    propertyName,
    propertyName.charAt(0).toUpperCase() + propertyName.slice(1)
  )
}

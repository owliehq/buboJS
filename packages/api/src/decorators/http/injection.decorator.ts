import 'reflect-metadata'
import { MetadataManager } from '../../MetadataManager'
import { ObjectType } from '../../utils'

export function Inject<T = any>(token: string): (target: Object, propertyName: string) => void
export function Inject(target: Object, propertyName: string): void

export function Inject<T = any>(
  token: string | any,
  propertyName?: string
): void | ((target: Object, propertyName: string) => void) {
  // Get the type of the property injection
  // TODO Refacto this

  if (propertyName) {
    let type = Reflect.getMetadata('design:type', token, propertyName)
    MetadataManager.setInjectionMetadata(token.constructor.name, propertyName, type.name)
  } else
    return (target: Object, propertyName: string): void => {
      MetadataManager.setInjectionMetadata(target.constructor.name, propertyName, token)
    }
}

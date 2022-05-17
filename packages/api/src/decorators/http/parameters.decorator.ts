import { MetadataManager } from '../../MetadataManager'

/**
 * Decorator to get parameter in url request
 * @param name of the parameter
 * @returns
 */
export const Params =
  (name: string) =>
  (target: any, propertyKey: string, index: number): any => {
    MetadataManager.setParametersMetadata(target.constructor.name, propertyKey, index, {
      getValue: (req: any) => {
        return req.params[name]
      }
    })
  }

/**
 * Decorator to get body in http request
 * @returns
 */
export const Body = (target: any, propertyKey: string, index: number): any => {
  MetadataManager.setParametersMetadata(target.constructor.name, propertyKey, index, {
    getValue: (req: any) => {
      return req.body
    }
  })
}

import { MetadataManager } from '../../MetadataManager'

/**
 * Decorator to get one parameter in url request
 * @param name of the parameter
 * @returns
 */
export const Params =
  (name: string) =>
  (target: any, propertyKey: string, index: number): any => {
    MetadataManager.setParameterMetadata(target.constructor.name, propertyKey, index, {
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
  MetadataManager.setParameterMetadata(target.constructor.name, propertyKey, index, {
    getValue: (req: any) => {
      return req.body
    }
  })
}

/**
 * Decorator to get one header
 * @param name of the header
 * @returns
 */
export const Header =
  (name: string) =>
  (target: any, propertyKey: string, index: number): any => {
    MetadataManager.setParameterMetadata(target.constructor.name, propertyKey, index, {
      getValue: (req: any) => {
        return req.get(name)
      }
    })
  }

/**
 * Decorator to get one query parameter in url request
 * @param name of the query parameter
 * @returns
 */
export const Query =
  (name: string) =>
  (target: any, propertyKey: string, index: number): any => {
    MetadataManager.setParameterMetadata(target.constructor.name, propertyKey, index, {
      getValue: (req: any) => {
        return req.query[name]
      }
    })
  }

import { HeaderType } from '../../enums/index.js'
import { MetadataManager } from '../../MetadataManager.js'

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
      },
      name,
      headerType: HeaderType.PARAM
    })
  }

/**
 * Decorator to get body in http request
 * @returns
 */
export const Body =
  (name?: string) =>
  (target: any, propertyKey: string, index: number): any => {
    if (name) {
      MetadataManager.setParameterMetadata(target.constructor.name, propertyKey, index, {
        getValue: (req: any) => {
          return req.body[name]
        },
        headerType: HeaderType.BODY
      })
    } else {
      MetadataManager.setParameterMetadata(target.constructor.name, propertyKey, index, {
        getValue: (req: any) => {
          return req.body
        },
        headerType: HeaderType.BODY
      })
    }
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
      },
      name,
      headerType: HeaderType.HEADER
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
      },
      name,
      headerType: HeaderType.QUERY
    })
  }

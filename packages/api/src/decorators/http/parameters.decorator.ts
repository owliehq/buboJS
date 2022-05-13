import { MetadataManager } from '../../MetadataManager'

export const Params =
  (name: string) =>
  (target: any, propertyKey: string, index: number): any => {
    MetadataManager.setParametersMetadata(target.constructor.name, propertyKey, index, {
      getValue: (req: any) => {
        return req.params[name]
      }
    })
  }

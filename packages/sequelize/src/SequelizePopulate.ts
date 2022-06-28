import { Association, FindOptions, Includeable, IncludeOptions, ModelStatic } from 'sequelize'
import { Model, ModelType, ModelCtor } from 'sequelize-typescript'

type PopulateMap = Map<string, PopulateMap>

export class SequelizePopulate {
  private readonly pathMap: PopulateMap
  private readonly model: { new (): Model } & typeof Model

  /**
   *  Build Sequelize populate object by registering all available path in a custom map */
  constructor(model: { new (): Model } & typeof Model, populatePaths: Array<string>) {
    this.model = model
    let pathMap = new Map<string, PopulateMap>()
    populatePaths.forEach(path => {
      const fields = path.split('.')
      this.addSplitPath(fields, pathMap)
    })
    this.pathMap = pathMap
  }

  /**
   * Build Sequelize Include Options corresponding to the requested paths and authorized paths
   * @param paths
   */
  public buildIncludeOptions(paths: string) {
    const map = this.buildRequestedMap(paths)
    const validatedMap = this.validateSubPopulateMap(map, this.pathMap)
    return this.recursiveInclude(validatedMap, this.model)
  }

  /**
   * Recursive function to parse and register possible paths
   * @param splitPath A sub array containing split path string (by '.')
   * @param map The sub map corresponding to the sub path
   * @private
   */
  private addSplitPath(splitPath: Array<string>, map: Map<string, PopulateMap>) {
    const key = splitPath[0]
    if (key) {
      const subMap = map.get(key) ?? new Map<string, PopulateMap>()
      const data = this.addSplitPath(splitPath.slice(1), subMap)
      map.set(key, data)
      return map
    }
    return map
  }

  /**
   * Build a PopulateMap based on the requested paths
   * @param requestedPaths requested paths
   * @private
   */
  private buildRequestedMap(requestedPaths: string) {
    return requestedPaths.split(' ').reduce((map, path) => {
      const fields = path.split('.')
      if (fields.length > 0) {
        const subMap = map.get(fields[0]) ?? new Map<string, PopulateMap>()
        map.set(fields[0], this.addSplitPath(fields.slice(1), subMap))
      }
      return map
    }, new Map<string, PopulateMap>())
  }

  /**
   * Build IncludeOption recursively based on a Map/SubMap and a Model/subModel
   * @param requestedAssociations
   * @param model
   * @private
   */
  private recursiveInclude(
    requestedAssociations: PopulateMap,
    model: ModelStatic<any> | ModelCtor<any>
  ): IncludeOptions[] {
    const result = Array.from(requestedAssociations.keys())
      .map(association => {
        const requestedAssociation = model.associations[association]
        if (requestedAssociation) {
          const subAssociations = requestedAssociations.get(association)
          let subInclude: IncludeOptions[] = []
          if (subAssociations) {
            subInclude = this.recursiveInclude(subAssociations, requestedAssociation.target)
          }
          return (
            subInclude.length
              ? { model: requestedAssociation.target, as: association, include: subInclude }
              : { model: requestedAssociation.target, as: association }
          ) as IncludeOptions
        } else {
          return undefined
        }
      })
      .filter((include): include is IncludeOptions => {
        return include !== undefined
      })
    return result
  }

  /**
   * Validate a requested path map against a second one
   * @param requestedMap
   * @param authorizedMap
   * @private
   */
  private validateSubPopulateMap(requestedMap: PopulateMap, authorizedMap: PopulateMap) {
    const authorizedKeys = Array.from(authorizedMap?.keys() ?? [])
    const forbiddenKeys = Array.from(requestedMap?.keys() ?? []).filter(key => {
      return !authorizedKeys.includes(key)
    })
    // remove unauthorized keys
    forbiddenKeys.forEach(key => {
      requestedMap.delete(key)
    })
    //recursive check
    if (requestedMap?.size) {
      Array.from(requestedMap.keys()).forEach(key => {
        requestedMap.set(key, this.validateSubPopulateMap(requestedMap.get(key), authorizedMap.get(key)))
      })
    }
    return requestedMap
  }
}

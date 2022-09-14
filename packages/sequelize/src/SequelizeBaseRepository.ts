import { Model } from 'sequelize-typescript'
import { CreateOptions, DestroyOptions, FindOptions, UpdateOptions } from 'sequelize'
import { ErrorFactory } from '@bubojs/http-errors'
import { BuboRepository, DefaultActions } from '@bubojs/api'

export type ModelQuery<Model> = { [K in keyof Model]?: Model[K] }

/* Create a Data only type for model by picking only fields that are not model, function or model array
 *  and omit every field that belong to Model itself */
export type ModelData<Type> = Omit<
  Pick<
    Type,
    {
      [K in keyof Type]: Type[K] extends Model | Function | Model[] ? never : K
    }[keyof Type]
  >,
  keyof Model
>

export class SequelizeBaseRepository<Type extends Model> implements BuboRepository<Type> {
  private readonly model: any // TODO add type

  constructor(model: any) {
    this.model = model
  }

  /**
   *
   * @param key
   * @param value
   * @param options
   */
  async findOneByNoThrow<Key extends keyof Type>(
    key: Key,
    value: Type[Key],
    options?: Omit<FindOptions, 'where'>
  ): Promise<Type | null> {
    let opt: FindOptions = options ? options : {}
    opt.where = { [key]: value }
    return (await this.model.findOne(opt)) as Promise<Type | null>
  }

  /**
   * Find by, throw error if object not found
   * @param key
   * @param value
   * @param options
   */
  async findOneBy<Key extends keyof Type>(
    key: Key,
    value: Type[Key],
    options?: Omit<FindOptions, 'where'>
  ): Promise<Type> {
    let opt: FindOptions = options ? options : {}
    opt.where = { [key]: value }
    const result = await this.model.findOne(opt)
    if (!result) throw ErrorFactory.NotFound({ message: `${this.model.name} not found` })
    return result as Type
  }

  /**
   *
   * @param key
   * @param value
   * @param options
   */
  async findAllBy<Key extends keyof Type>(
    key: Key,
    value: Type[Key],
    options?: Omit<FindOptions, 'where'>
  ): Promise<Array<Type>> {
    let opt: FindOptions = options ? options : {}
    opt.where = { [key]: value }
    const result = await this.model.findAll(opt)
    if (!result) throw ErrorFactory.NotFound({ message: `${this.model.name} not found` })
    return result as Array<Type>
  }

  /**
   *
   * @param key
   * @param value
   * @param options
   */
  async deleteBy<Key extends keyof Type>(
    key: Key,
    value: Type[Key],
    options?: Omit<FindOptions, 'where'>
  ): Promise<void> {
    let opt: FindOptions = options ? options : {}
    opt.where = { [key]: value }
    return await this.model.destroy(opt)
  }

  async findAllMatching(
    query: ModelQuery<Type>,
    options?: Omit<FindOptions, 'where'>
  ): Promise<Array<Type> | undefined> {
    let opt: FindOptions = options ? options : {}
    opt.where = Object.assign({}, query) as any
    return (await this.model.findAll(opt)) as Array<Type> | undefined
  }

  async create(data: ModelData<Type>, options?: CreateOptions): Promise<Type> {
    return await this.model.create(data, options)
  }

  async findById(pk: string, options?: FindOptions): Promise<Type> {
    const result = await this.model.findByPk(pk, options)
    if (!result) throw ErrorFactory.NotFound({ message: `${this.model.name} not found` })
    return result as Type
  }

  async findAll(options?: FindOptions): Promise<Array<Type>> {
    return (await this.model.findAll(options)) as Array<Type>
  }

  async update(pk: string, data: Partial<ModelData<Type>>, options?: UpdateOptions): Promise<Type> {
    let original = (await this.model.findByPk(pk, options)) as Type
    return await original.update(data, options)
  }

  async delete(pk: string, options?: DestroyOptions): Promise<void> {
    const item = await this.findById(pk, options)
    return item.destroy(options)
  }

  requestOptions(routeType: DefaultActions) {
    switch (routeType) {
      case DefaultActions.GET_MANY:
        return this.getManyOptions
      case DefaultActions.GET_ONE:
        return this.getOneOptions
      case DefaultActions.CREATE_ONE:
        return this.createOptions
      case DefaultActions.DELETE_ONE:
        return this.deleteOptions
      case DefaultActions.UPDATE_ONE:
        return this.updateOptions
      default:
        return () => {}
    }
  }

  private createOptions(req: any) {
    return req.$sequelize || {}
  }
  private getOneOptions(req: any) {
    return req.$sequelize || {}
  }
  private getManyOptions(req: any) {
    let opt: FindOptions = req.$sequelize || {}
    let limit = req.query.limit
    let offset = req.query.offset
    if (!limit) {
      throw ErrorFactory.UnprocessableEntity({ message: 'missing limit in query' })
    }
    opt.limit = limit
    opt.offset = offset
    return opt
  }
  private updateOptions(req: any) {
    return req.$sequelize
  }
  private deleteOptions(req: any) {
    return req.$sequelize
  }
}

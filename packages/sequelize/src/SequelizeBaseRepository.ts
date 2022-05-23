import { Model, FindOptions, Op, CreateOptions, UpdateOptions, DestroyOptions } from 'sequelize'
//import { NotFoundError } from '@owliehq/http-errors'
import { BuboRepository } from "@bubojs/api";

export type ModelQuery<Model> = { [K in keyof Model]?: Model[K] }

export class SequelizeBaseRepository<Type extends Model> extends BuboRepository<Type>{
    private readonly modelGetter: any // TODO add type

    constructor(getter: any) {
        super()
        this.modelGetter = getter
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
        return await this.modelGetter().findOne(opt) as Promise<Type | null>
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
        const result = await this.modelGetter().findOne(opt)
        //TODO add errors
        //if (!result) throw new NotFoundError(this.modelGetter().name)
        if (!result) throw new Error(`${this.modelGetter().name} not found`)
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
        const result = await this.modelGetter().findAll(opt)
        //TODO add errors
        //if (!result) throw new NotFoundError(this.modelGetter().name)
        if (!result) throw new Error(`${this.modelGetter().name} not found`)
        return result as Array<Type>
    }

    /**
     *
     * @param key
     * @param value
     * @param options
     */
    async deleteBy<Key extends keyof Type>(key: Key, value: Type[Key], options?: Omit<FindOptions, 'where'>): Promise<void> {
        let opt: FindOptions = options ? options: {}
        opt.where = {[key]: value}
        return await this.modelGetter().destroy(opt)
    }

    async findAllMatching(query: ModelQuery<Type>, options?: Omit<FindOptions, 'where'>): Promise<Array<Type> | undefined> {
        let opt: FindOptions = options ? options : {}
        opt.where = Object.assign({}, query) as any
        return await this.modelGetter().findAll(opt) as Array<Type> | undefined
    }

    async create(data: { [K in keyof Type]: Type[K] }, options: CreateOptions): Promise<Type> {
        return await this.modelGetter().create(data, options)
    }

    async getOne(pk: string, options: FindOptions): Promise<Type> {
        const result = await this.modelGetter().findByPk(pk,options)
        //TODO add errors
        //if (!result) throw new NotFoundError(this.modelGetter().name)
        if (!result) throw new Error(`${this.modelGetter().name} not found`)
        return result as Type
    }

    async getMany(options: FindOptions): Promise<Array<Type>> {
        return await this.modelGetter().findAll(options) as Array<Type>
    }

    async update(pk: string, data: { [K in keyof Type]?: Type[K] }, options: UpdateOptions): Promise<Type> {
        let findOptions : FindOptions = options ? { transaction: options.transaction } : {}
        let original = await this.modelGetter().findByPk(pk, findOptions) as Type
        return await original.update(data, options)
    }

    async delete(pk: string, options: DestroyOptions): Promise<void>{
        await this.modelGetter().destroy(pk, options)
    }
}

import { BuboRepository, DefaultActions } from '@bubojs/api'

export class DBMiddlewareRepository<Type extends string> implements BuboRepository<Type> {
  private readonly model: any
  constructor(model: any) {
    this.model = model
  }

  async findOneByNoThrow<Key extends keyof Type>(key: Key, value: Type[Key], ...any: any[]): Promise<Type | null> {
    return 'findOneByNoThrow' as unknown as Promise<Type | null>
  }

  async findOneBy<Key extends keyof Type>(key: Key, value: Type[Key], ...any: any[]): Promise<Type> {
    return 'findOneBy' as unknown as Promise<Type | null>
  }

  async findAllBy<Key extends keyof Type>(key: Key, value: Type[Key], ...any: any[]): Promise<Type[]> {
    return ['findOneBy', 'findOneByNoThrow', 'findAllBy'] as Array<Type>
  }

  async deleteBy<Key extends keyof Type>(key: Key, value: Type[Key], ...any: any[]): Promise<void> {
    return
  }

  async create(data: { [K in keyof Type]: Type[K] }, ...any: any[]): Promise<Type> {
    return 'create' as unknown as Promise<Type>
  }

  async update(pk: string, data: { [K in keyof Type]?: Type[K] }, ...any: any[]): Promise<Type> {
    return 'update' as unknown as Promise<Type>
  }

  async delete(pk: string, ...any: any[]): Promise<void> {
    return
  }

  async findById(pk: string, ...any: any[]): Promise<Type> {
    return 'findById' as unknown as Promise<Type>
  }

  async findAll(...any: any[]): Promise<Type[]> {
    return ['findAll'] as unknown as Promise<Type[]>
  }

  requestOptions(routeType: DefaultActions): (req: any) => any {
    return req => []
  }
}

export class MiddlewareRepository extends DBMiddlewareRepository<string> {
  constructor() {
    super(String)
  }
}

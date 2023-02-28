import { BuboRepository, Controller, DefaultActions, Get, MetadataManager } from '../src/index'

describe('controllers decorator', () => {
  const CONTROLLER_NAME = 'ControllerDefaultRoutesTest'

  class DBDefaultActionsRepository<Type extends string> implements BuboRepository<Type> {
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

    requestOptions(routeType) {
      return req => []
    }
  }

  class DefaultActionsRepository extends DBDefaultActionsRepository<string> {
    constructor() {
      super(String)
    }
  }

  @Controller({ repository: new DefaultActionsRepository(), overrideRouteName: 'decorator' })
  class ControllerDefaultRoutesTest {
    [DefaultActions.GET_ONE]() {}

    [DefaultActions.GET_MANY]() {}

    [DefaultActions.CREATE_ONE]() {}

    [DefaultActions.UPDATE_ONE]() {}

    [DefaultActions.DELETE_ONE]() {}
  }

  it('should create get_one route', () => {
    const routeMetadata = MetadataManager.getRouteMetadata(CONTROLLER_NAME, DefaultActions.GET_ONE)
    expect(routeMetadata).toBeTruthy()
  })

  it("shouldn't create get_many route", () => {
    const routeMetadata = MetadataManager.getRouteMetadata(CONTROLLER_NAME, DefaultActions.GET_MANY)
    expect(routeMetadata).toBeTruthy()
  })

  it('should create create_one route', () => {
    const routeMetadata = MetadataManager.getRouteMetadata(CONTROLLER_NAME, DefaultActions.CREATE_ONE)
    expect(routeMetadata).toBeTruthy()
  })

  it('should create update_one route', () => {
    const routeMetadata = MetadataManager.getRouteMetadata(CONTROLLER_NAME, DefaultActions.UPDATE_ONE)
    expect(routeMetadata).toBeTruthy()
  })

  it('should create delete_one route', () => {
    const routeMetadata = MetadataManager.getRouteMetadata(CONTROLLER_NAME, DefaultActions.DELETE_ONE)
    expect(routeMetadata).toBeTruthy()
  })
})

describe('controller default and custom routes', () => {
  const CONTROLLER_NAME = 'ControllerDefaultAndCustomRoutesTest'
  const ROUTE_TEST_NAME = 'routeTest'

  class DBDefaultActionsRepository<Type extends string> implements BuboRepository<Type> {
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

    requestOptions(routeType) {
      return req => []
    }
  }

  class DefaultActionsRepository extends DBDefaultActionsRepository<string> {
    constructor() {
      super(String)
    }
  }

  @Controller({ repository: new DefaultActionsRepository(), overrideRouteName: 'decorator' })
  class ControllerDefaultAndCustomRoutesTest {
    [DefaultActions.GET_ONE]() {}

    @Get('/')
    public routeTest() {}

    [DefaultActions.CREATE_ONE]() {}

    [DefaultActions.DELETE_ONE]() {}
  }

  it('should register route test but not GET_MANY default route', () => {
    const routeTestMetadata = MetadataManager.getRouteMetadata(CONTROLLER_NAME, ROUTE_TEST_NAME)
    const defaultRouteMetadata = MetadataManager.getRouteMetadata(CONTROLLER_NAME, DefaultActions.GET_MANY)
    expect(routeTestMetadata).toBeTruthy()
    expect(defaultRouteMetadata).toBeFalsy()
  })
})

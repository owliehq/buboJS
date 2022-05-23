import { Controller, DefaultActions, Get } from '../../src'
import { MetadataManager } from '../../src/MetadataManager'

describe('controllers decorator', () => {
  const CONTROLLER_NAME = 'ControllerDefaultRoutesTest'

  @Controller('decorator')
  class ControllerDefaultRoutesTest {
    [DefaultActions.GET_ONE]() {}

    [DefaultActions.GET_MANY]() {}

    [DefaultActions.CREATE_ONE]() {}

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

  it('should create delete_one route', () => {
    const routeMetadata = MetadataManager.getRouteMetadata(CONTROLLER_NAME, DefaultActions.DELETE_ONE)
    expect(routeMetadata).toBeTruthy()
  })
})

describe('controller default and custom routes', () => {
  const CONTROLLER_NAME = 'ControllerDefaultAndCustomRoutesTest'
  const ROUTE_TEST_NAME = 'routeTest'

  @Controller('decorator')
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

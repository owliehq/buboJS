import { Controller, Get, Post } from '../../src/index'
import { MetadataManager } from '../../src/MetadataManager'

describe('controllers decorator', () => {
  const CONTROLLER_NAME = 'ControllerRoutesDecoratorTest'
  const GET_ROUTE_NAME = 'testGet'
  const POST_ROUTE_NAME = 'testPost'

  @Controller({ overrideRouteName: 'routes' })
  class ControllerRoutesDecoratorTest {
    @Get()
    public testGet() {}

    @Post()
    public testPost() {}
  }

  it('should save Get route metadata', () => {
    const path = MetadataManager.getRouteMetadata(CONTROLLER_NAME, GET_ROUTE_NAME)
    expect(path).toBeTruthy()
    expect(path.method).toBe('GET')
  })

  it('should save Post route metadata', () => {
    const path = MetadataManager.getRouteMetadata(CONTROLLER_NAME, POST_ROUTE_NAME)
    expect(path).toBeTruthy()
    expect(path.method).toBe('POST')
  })
})

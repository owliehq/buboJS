import { Controller, Get, MetadataManager } from '../../src/index'

describe('controllers decorator', () => {
  const CONTROLLER_NAME = 'ControllerDecoratorTest'

  @Controller({ overrideRouteName: 'decorator' })
  class ControllerDecoratorTest {
    @Get('/')
    public routeTest() {}
  }

  it('should have saved data in the metadataManager', () => {
    const controllerMetadata = MetadataManager.getControllerMetadata(CONTROLLER_NAME)
    expect(controllerMetadata).toBeTruthy()
  })

  it('should have saved routes data in the metadataManager', () => {
    const controllerMetadata = MetadataManager.getControllerMetadata(CONTROLLER_NAME)
    expect(controllerMetadata.routes).toBeTruthy()
    expect(Object.entries(controllerMetadata.routes).length).toBeGreaterThanOrEqual(1)
  })
})

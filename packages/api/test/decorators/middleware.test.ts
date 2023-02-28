import { Controller, Get, MiddlewarePosition, MetadataManager } from '../../src/index'
import { AfterMiddleware, BeforeMiddleware } from '../../src/decorators/http/middleware.decorator'

describe('controllers decorator', () => {
  const CONTROLLER_NAME = 'MiddlewareDecoratorTest'
  const ROUTE_TEST_NAME = 'routeTest'

  @Controller({ overrideRouteName: 'middlewares' })
  class MiddlewareDecoratorTest {
    @BeforeMiddleware((req: any, res: any, next: Function): void => {
      next()
    })
    @AfterMiddleware((req: any, res: any, next: Function): void => {
      next()
    })
    @Get('/')
    public routeTest() {}
  }

  it('should have saved before middleware in the metadataManager', () => {
    const middlewaresMetadata = MetadataManager.getMiddlewaresMetadata(
      CONTROLLER_NAME,
      ROUTE_TEST_NAME,
      MiddlewarePosition.BEFORE
    )
    expect(middlewaresMetadata).toBeTruthy()

    const middlewaresMetadataMap = Object.entries(middlewaresMetadata)
    expect(middlewaresMetadataMap.length).toBeGreaterThanOrEqual(1)
  })

  it('should have saved after middleware in the metadataManager', () => {
    const middlewaresMetadata = MetadataManager.getMiddlewaresMetadata(
      CONTROLLER_NAME,
      ROUTE_TEST_NAME,
      MiddlewarePosition.AFTER
    )
    expect(middlewaresMetadata).toBeTruthy()

    const middlewaresMetadataMap = Object.entries(middlewaresMetadata)
    expect(middlewaresMetadataMap.length).toBeGreaterThanOrEqual(1)
  })
})

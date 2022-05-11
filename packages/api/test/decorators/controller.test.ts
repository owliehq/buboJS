import { Controller, Get } from '../../src';
import { MetadataManager } from '../../src/MetadataManager';

describe('controllers decorator', () => {
  const CONTROLLER_NAME = 'ControllerDecoratorTest';

  @Controller('decorator')
  class ControllerDecoratorTest {
    @Get('/')
    public routeTest() {}
  }

  it('should save metadata controller decorator', () => {
    const path = MetadataManager.getControllerMetadata(CONTROLLER_NAME);
    expect(path).toBeTruthy();
    expect(Object.entries(path.routes).length).toBeGreaterThanOrEqual(1);
  });
});

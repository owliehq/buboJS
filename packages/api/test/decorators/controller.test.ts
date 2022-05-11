import { Controller } from '../../src';
import { MetadataManager } from '../../src/MetadataManager';

describe('controllers decorator', () => {
  const CONTROLLER_NAME = 'ControllerDecoratorTest';

  @Controller('decorator')
  class ControllerDecoratorTest {}

  it('should save metadata controller decorator', () => {
    const path = MetadataManager.getControllerMetadata(CONTROLLER_NAME);
    expect(path).toBeTruthy();
    expect(path.routes.length).toBeGreaterThanOrEqual(0);
    expect(path.path).toBe('/decorator');
    expect(true).toBeTruthy();
  });
});

import { MetadataManager } from '@bubojs/api'
import { DocBuilder, MetadataConverter } from '../src'

let converter: MetadataConverter

beforeAll(async () => {
  converter = new MetadataConverter()
})
describe('json result', () => {
  it('should createMetadata', () => {
    const controllerMetadata = MetadataManager.getControllerMetadata('TaskController')
    expect(controllerMetadata).toBeTruthy()
  })
  it('should transform metadata into json path', () => {
    const controllerMetadata = MetadataManager.getControllerMetadata('TaskController')
    const jsonSwagger = converter.convertController(controllerMetadata)
    expect(jsonSwagger).toBe({
      openapi: '3.0.3'
    })
  })
})

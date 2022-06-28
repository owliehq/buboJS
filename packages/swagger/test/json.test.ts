import { HeaderType, MetadataManager } from '@bubojs/api'
import { RouteMethod } from '../../api/src/enums'
import { DocBuilder, MetadataConverter } from '../src'
import { TaskController } from './mock/TaskController'

let converter: MetadataConverter

beforeAll(async () => {
  TaskController.name
  converter = new MetadataConverter()
})
describe('json result', () => {
  it('should createMetadata', () => {
    const controllerMetadata = MetadataManager.getControllerMetadata('TaskController')
    expect(controllerMetadata).toBeTruthy()
  })

  it('should transform routeMetadata into openapijson format', () => {
    const docBuilder = new DocBuilder()
    const routeOpenAPI = docBuilder.createRoute(
      {
        method: RouteMethod.GET,
        parameters: [],
        path: '/',
        handler: () => {}
      },
      { tag: 'testJSON' }
    )
    expect(routeOpenAPI).toStrictEqual({
      parameters: [],
      responses: {
        '200': {
          description: 'OK',
          content: { 'application/json': {} }
        }
      }
    })
  })

  it('should transform param parameterMetadata into openapijson format', () => {
    const docBuilder = new DocBuilder()
    const paramOpenAPI = docBuilder.createParameter({ name: 'id', headerType: HeaderType.PARAM, getValue: () => {} })
    expect(paramOpenAPI).toStrictEqual({
      in: 'path',
      name: 'id'
    })
  })

  it('should transform query parameterMetadata into openapijson format', () => {
    const docBuilder = new DocBuilder()
    const paramOpenAPI = docBuilder.createParameter({ name: 'limit', headerType: HeaderType.QUERY, getValue: () => {} })
    expect(paramOpenAPI).toStrictEqual({
      in: 'query',
      name: 'limit'
    })
  })

  it('should transform header parameterMetadata into openapijson format', () => {
    const docBuilder = new DocBuilder()
    const paramOpenAPI = docBuilder.createParameter({ name: 'host', headerType: HeaderType.HEADER, getValue: () => {} })
    expect(paramOpenAPI).toStrictEqual({
      in: 'header',
      name: 'host'
    })
  })

  it('should transform metadata into json path', () => {
    const controllerMetadata = MetadataManager.getControllerMetadata('TaskController')
    const jsonSwagger = converter.convertController(MetadataManager.meta)
    // console.log(JSON.stringify(jsonSwagger, null, 2))
    // expect(jsonSwagger).toBe({
    //   openapi: '3.0.3',
    //   info: {
    //     title: 'api sample',
    //     version: 'v1'
    //   },
    //   paths: {
    //     '/tasks': {
    //       get: {
    //         description: 'R',
    //         responses: {
    //           '200': {
    //             description: 'Success',
    //             content: {
    //               'text/plain': {
    //                 schema: {
    //                   $ref: '#/components/schemas/Task'
    //                 }
    //               },
    //               'application/json': {
    //                 schema: {
    //                   $ref: '#/components/schemas/Task'
    //                 }
    //               },
    //               'text/json': {
    //                 schema: {
    //                   $ref: '#/components/schemas/Task'
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     }
    //   },
    //   components: {
    //     schemas: {
    //       Task: {
    //         type: 'object',
    //         properties: {
    //           id: {
    //             type: 'string',
    //             nullable: true,
    //             readOnly: true
    //           },
    //           content: {
    //             type: 'string',
    //             nullable: true,
    //             readOnly: true
    //           }
    //         },
    //         additionalProperties: false
    //       }
    //     },
    //     securitySchemes: {
    //       bearerAuth: {
    //         type: 'http',
    //         description: 'JWT Authorization header using the Bearer scheme.',
    //         scheme: 'bearer',
    //         bearerFormat: 'JWT'
    //       }
    //     }
    //   },
    //   security: [
    //     {
    //       bearerAuth: []
    //     }
    //   ]
    // })
  })
})

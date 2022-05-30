import { ControllerMetadata } from '@bubojs/api'
import { OpenApiJSONType } from './interfaces'

export class MetadataConverter {
  convertController(controllerMetadata: ControllerMetadata): OpenApiJSONType {
    return {
      openapi: '3.0.3',
      info: {
        title: 'api sample',
        version: 'v1'
      },
      paths: {
        '/tasks': {
          get: {
            description: 'R',
            responses: {
              '200': {
                description: 'Success',
                content: {
                  'text/plain': {
                    schema: {
                      $ref: '#/components/schemas/Task'
                    }
                  },
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/Task'
                    }
                  },
                  'text/json': {
                    schema: {
                      $ref: '#/components/schemas/Task'
                    }
                  }
                }
              }
            }
          }
        }
      },
      components: {
        schemas: {
          Task: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                nullable: true,
                readOnly: true
              },
              content: {
                type: 'string',
                nullable: true,
                readOnly: true
              }
            },
            additionalProperties: false
          }
        },
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            description: 'JWT Authorization header using the Bearer scheme.',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      },
      security: [
        {
          bearerAuth: []
        }
      ]
    }
  }
}

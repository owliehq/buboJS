import { MetadataManager, MiddlewareMetadata, MiddlewarePosition } from '@bubojs/api'
import Validator, { ValidationError } from 'fastest-validator'

const getParamsFieldName = req => {
  switch (req.method) {
    case 'POST':
      return 'body'
    case 'PUT':
      return 'body'
    case 'GET':
      return 'query'
    case 'DELETE':
      return 'query'
  }
}

export const validationMiddleware = (
  validationData: ValidationData,
  controllerName: string,
  routeName: string
): MiddlewareMetadata[] => {
  const { beforeValidationMiddleware } = validationData

  let middlewares: MiddlewareMetadata[] = []
  const { schema, validatorOptions, handlerOptions } = validationData
  const v = new Validator(validatorOptions)
  const check = v.compile(schema)
  const handler = async (req: any, res: any, next: Function) => {
    const reqParamsField = handlerOptions?.forceRequestField || getParamsFieldName(req)
    const parameters = req[reqParamsField]
    try {
      let checked = check(parameters)
      let checkResult = checked instanceof Promise ? await checked : checked
      let result = {}
      Object.keys(schema).map(key => {
        result[key] = parameters[key]
      })
      req[reqParamsField] = result
      if (checkResult === true) {
        next()
      } else {
        res.status(422).json({ statusCode: 422, message: checkResult })
      }
    } catch (err) {
      res.status(500).send({ message: 'Unhandled error in validator' })
    }
  }
  middlewares.push(handler)
  if (beforeValidationMiddleware) middlewares.push(beforeValidationMiddleware)

  return middlewares
}

export interface ValidationData {
  beforeValidationMiddleware?: MiddlewareMetadata
  schema: Object
  validatorOptions?: Object
  handlerOptions?: {
    forceRequestField: 'body' | 'query'
  }
}

export const ValidationMiddleware = (validationData: ValidationData) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    for (const middleware of validationMiddleware(validationData, target.constructor.name, propertyKey)) {
      MetadataManager.setMiddlewareMetadata(target.constructor.name, propertyKey, MiddlewarePosition.BEFORE, middleware)
    }
  }
}

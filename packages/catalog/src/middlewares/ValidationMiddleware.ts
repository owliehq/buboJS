import { MetadataManager, MiddlewareMetadata, MiddlewarePosition } from '@bubojs/api'
import Validator, { ValidationError } from 'fastest-validator'

export const validationMiddleware = (
  validationData: ValidationData,
  controllerName: string,
  routeName: string
): MiddlewareMetadata[] => {
  const { beforeValidationMiddleware } = validationData

  let middlewares: MiddlewareMetadata[] = []
  const handler = async (req: any, res: any, next: Function) => {
    // TODO refacto "req.body ? req.body : req.query"

    const parameters = req.body ? req.body : req.query

    const check = MetadataManager.getRouteValidatorMetadata(controllerName, routeName)

    let checked = check(parameters)
    let checkResult = checked instanceof Promise ? await checked : checked
    let result = {}
    Object.entries(parameters).map(([key, value]) => {
      result[key] = value
    })
    if (req.body) req.body = result
    else if (req.query) req.query = result
    if (checkResult && typeof checkResult === 'boolean') {
      next()
    } else {
      res.status(422).json({ statusCode: 422, message: checkResult })
    }
  }
  middlewares.push(handler)
  if (beforeValidationMiddleware) middlewares.push(beforeValidationMiddleware)

  return middlewares
}

export interface ValidationData {
  beforeValidationMiddleware?: MiddlewareMetadata
  schema?: Object
  validatorOptions?: Object
}

export const ValidationMiddleware = (validationData: ValidationData) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    // building validation checker
    const { schema, validatorOptions } = validationData
    const v = new Validator(validatorOptions)
    const check = v.compile(schema)
    MetadataManager.setRouteValidatorMetadata(target.constructor.name, propertyKey, check)

    // push middleware to controller's middleware stack
    for (const middleware of validationMiddleware(validationData, target.constructor.name, propertyKey)) {
      MetadataManager.setMiddlewareMetadata(target.constructor.name, propertyKey, MiddlewarePosition.BEFORE, middleware)
    }
  }
}

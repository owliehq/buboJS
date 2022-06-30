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

    let checkResult: Promise<true | ValidationError[]> | true | ValidationError[]
    if (check.async) {
      checkResult = await check(parameters)
      let result = {}
      await Promise.all(
        Object.entries(parameters).map(async ([key, value]) => {
          result[key] = await value
        })
      )
      if (req.body) req.body = result
      else if (req.query) req.query = result
    } else {
      checkResult = check(req.body ? req.body : req.query)
    }

    if (checkResult && typeof checkResult === 'boolean') {
      next()
    } else {
      res.status(422).json({ statusCode: 422, message: checkResult })
    }
  }
  middlewares.push(handler)
  // middlewares.push((req: any, res: any, next: Function) => {
  //   console.log('add validator')
  //   const v = new Validator(validatorOptions)
  //   const check = v.compile(schema)
  //   req.check = check
  //   next()
  // })
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
    for (const middleware of validationMiddleware(validationData, target.constructor.name, propertyKey)) {
      MetadataManager.setMiddlewareMetadata(target.constructor.name, propertyKey, MiddlewarePosition.BEFORE, middleware)
    }

    const { schema, validatorOptions } = validationData

    const v = new Validator(validatorOptions)
    const check = v.compile(schema)

    MetadataManager.setRouteValidatorMetadata(target.constructor.name, propertyKey, check)
  }
}

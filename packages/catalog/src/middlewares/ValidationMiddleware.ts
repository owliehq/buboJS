import Validator from 'fastest-validator'
import { ValidationError } from 'fastest-validator'
import { BeforeMiddleware, MiddlewareMetadata } from '../../../api/src'

export const validationMiddleware = (validationData: ValidationData): MiddlewareMetadata[] => {
  const { beforeValidationMiddleware, schema, validatorOptions } = validationData

  const v = new Validator(validatorOptions)
  const check = v.compile(schema)

  let middlewares: MiddlewareMetadata[] = []
  if (beforeValidationMiddleware) middlewares.push(beforeValidationMiddleware)
  if (schema) {
    const handler = async (req: any, res: any, next: Function) => {
      const parameters = { ...req.body, ...req.query }

      let checkResult: Promise<true | ValidationError[]> | true | ValidationError[]
      if (check.async) {
        checkResult = await check(parameters)
      } else {
        checkResult = check(parameters)
      }

      if (checkResult && typeof checkResult === 'boolean') {
        next()
      } else {
        res.status(422).json({ statusCode: 422, message: checkResult })
      }
    }
    middlewares.push(handler)
  }
  return middlewares
}

export interface ValidationData {
  beforeValidationMiddleware?: MiddlewareMetadata
  schema?: Object
  validatorOptions?: Object
}

// export interface Middleware {
//   (req: any, res: any, next: Function): void
// }

export const ValidationMiddleware = (validationData: ValidationData) => {
  return BeforeMiddleware(validationMiddleware(validationData))
}

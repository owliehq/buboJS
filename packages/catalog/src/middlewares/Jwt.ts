import jsonwebtoken from 'jsonwebtoken'
import { ErrorFactory } from '@bubojs/http-errors'

export class JwtAuth {
  public static TokenStrategyMiddlewareBuilder(accessTokenSecret: any, userGetter: Function) {
    return async (req: any, res: any, next: Function) => {
      try {
        const authHeader = req.get('Authorization')
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const token = authHeader.substring(7, authHeader.length)
          const decoded: any = jsonwebtoken.verify(token, accessTokenSecret)
          const { id } = decoded
          const user = await userGetter(id)
          req.user = user
        }
        next()
      } catch (error) {
        next(ErrorFactory.UnprocessableEntity({ message: 'JSON Web Token Malformed' }))
      }
    }
  }
}

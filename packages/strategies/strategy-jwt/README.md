<p align="center">
  <a href="https://github.com/owliehq/buboJS/tree/develop">
    <img src="https://owlie.xyz/bubo/bubo-js.png">
  </a>
</p>

## JWT Auth ##

[![JWT](https://img.shields.io/npm/v/@bubojs/strategy-jwt?label=strategy-jwt)](https://www.npmjs.com/package/@bubojs/strategy-jwt)

[Back To Main Menu](../../../README.md#authentication-and-rights)

### JWT Global Middleware ###

The JwtAuth middleware looks for a token in the __Authorization__ field of the request, if it exists and is well formatted the middleware will fill the req.user field with the identified user

the middleware builder takes two arguments :

- the secret token jwt
- A function that allows to retrieve the user thanks to the id contained in the token

the middleware can be applied on all routes:

```ts
import { TinyHttpAdapter } from '@bubojs/tinyhttp'
import { app, AppOptions } from '@bubojs/api'
import { JwtAuth } from '@bubojs/catalog'

export const startServer = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const adapter = new TinyHttpAdapter()
      const appOptions: AppOptions = {
        errorMiddleware: (err: any, req: any, res: any, next?: Function) => {
          console.log('Caught Server Error ', err)
          res.status(500).json(err)
        },
        port: 3000
      }
      adapter.app.use(
        JwtAuth.TokenStrategyMiddlewareBuilder(env.NODE.access_token_secret, async (id: string) => {
          return await User.findByPk(id, { include: [{ model: Avatar }] })
        })
      )
      const server = await app.initHttpModule(adapter, appOptions)
      resolve(server)
    } catch (err) {
      reject(err)
    }
  })
}

```

### AuthMiddleware ###

the AuthMiddleware decorator checks the presence of the __user__ field in req and returns a 401 error if it is not the case, the decorator is placed on the route you want to protect:

```ts
import { Controller, DefaultActions} from '@bubojs/api'
import { AuthMiddleware } from '@bubojs/catalog'

@Controller({ repository: userRepository })
export class UsersController {
  constructor() {
  }

  @AuthMiddleware()
  [DefaultActions.GET_ONE]() {}
```

[Back to Main Menu](../../../README.md#authentication-and-rights)

## Editor ##

<p>
  <a href="https://www.owlie.xyz">
    <img style="border-radius:50%" width="100" height="100" src="https://www.owlie.xyz/bubo/owlielogo.png">
  </a>
</p>
# JWT Auth #

[Back To Authentification Menu](../README.md)
[Back To Main Menu](../../../README.md)

## JWT Global Middleware ##

Le middleware JwtAuth cherche un token dans le champ __Authorisation__ de la requete, s'il existe et est bien formaté le middleware remplira le champ req.user avec l'utilisateur identifié

le builder de middleware prend deux arguments :

- le secret token jwt
- Une fonction qui permet de recupérer l'utilisateur grace à l'id contenu dans le token

le middleware peut etre appliqué sur tous l'ensemble des routes:

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

## AuthMiddleware ##

le decorateur AuthMiddleware permet de vérifier la présence du champ __user__ dans req et renvoyer une erreur 401 si ce n'est pas le cas, le decorateur se place sur la route que vous voulez protéger:

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

[Back To Authentification](../README.md)
[Back to Main Menu](../../../README.md)

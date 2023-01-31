# BuboJS

## Contribution

### Install

Install modules using lerna bootstrap to centralize all modules in root node_modules.

```bash
lerna bootstrap
```

### Build

It's necessary to build ts files into js files to execute them
This command remove previous build dir and build them with tsc compiler

```bash
yarn build
```

### Run tests

Jest run all \*.test.ts files in packages/\* dir
⚠️You should build packages to execute tests⚠️

```bash
yarn test
```

## Présentation ##

BuboJs est une bibliothèque permettant de construire rapidement et efficacement une API Rest, il est basé sur NodeJS, ecrit entierement en Typescript et utilisant les ESModules.
Principales Features:

- Construction automatique de routes avec un lien direct avec la base de données (PostGres)
- Outils de Gestion des roles intégré
- Outils d'upload et Download de fichier (firebase)
- Outils de Validations des Routes

## Démarrer le serveur ##

Pour mettre en marche le serveur vous devez instancier un HttpAdapter (actuellement seul tinyhttp est disponible)
Ensuite pour effectivement démarrer le serveur vous devez passer cette instance ainsi que les options dont vous avez besoin à la fonction __app.initHttpModule()__

exemple:

```ts
import { TinyHttpAdapter } from '@bubojs/tinyhttp'
import { app, AppOptions } from '@bubojs/api'

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
      const server = await app.initHttpModule(adapter, appOptions)
      resolve(server)
    } catch (err) {
      reject(err)
    }
  })
}

```

## Les Controllers ##

[Api](packages/api/README.md)

## Validateur  de route ##

[Fastest Validator](packages/validation/README.md)

## Upload de fichier ##

[Firebase](packages/providers/uploader-firebase/README.md)

[Amazon S3](packages/providers/uploader-aws-s3/README.md)

## Authentification et droits ##

Pour gérer l'authentification actuellement seul JWT est disponible mais vous pouvez ajouter votre système d'authentification et d'autres seront ajoutés par la suite

En ce qui concerne les droits c'est la bibliothèque [role-acl](https://github.com/tensult/role-acl) qui est utilisée

[Strategies D'authentification](/packages/strategies/README.md)

[Access Control List](/packages/acl/README.md)

## Gestion des Bases de Données ##

[Sequelize](packages/sequelize/README.md)

## Middleware customs ##

Vous pouvez définir vos propres middlewares, ils peuvent ^etre appelés avant ou après l'exécution de la route, pour les middlewares qui s'exécutent après la route il n'y a pas besoin d'envoyer le resultat, cela peut etre fait automatiquement car bubo ajoute de lui meme un dernier middleware qui renvoi ce que se trouve dans __req.result__

Les middlewares sont exécutés dans le meme ordre que celui d'ajout dans le code (celui le plus haut au-dessus de la route sera exécuté en premier)

### Before Middleware ###

TODO trouver exemple

### After Middleware ###

TODO Trouver exemple

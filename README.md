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

## Création D'un controlleur ##

Pour faire un controlleur le fichier qui contient la classe doit finir par "Controller.ts", une recherche est faite dans les noms de fichier du projet pour trouver les différents controlleurs

Ensuite la class Controller doit etre décorée par un

```ts
@Controller() 
```

Cela entrainera la creation d'une sub route, le nom de cette subroute sera le nom de la classe controller sans le controller à la fin, ecrit en snake case et le tout mis au pluriel
le decorateur prend un objet d'options optionnel en paramètre qui contient deux champs :

```ts
export interface ControllerParams {
  repository?: BuboRepository<unknown>
  overrideRouteName?: string
}
```

__repository__ permet de définir un repository qui permettra de générer des routes automatiquement
__overrideRouteName__ permet lui de définir un autre nom de route que celui généré automatiquement

## Ajout d'une route automatique ##

Pour construire une route automatique il faut fournir au controller un repository (actuellement uniquement [sequelize](packages/sequelize/README.md) est disponible)

Le repository

```ts

import { SequelizeBaseRepository } from '@bubojs/sequelize'
import { SqlzModel } from './SqlzModel'

class MyRepository extends SequelizeBaseRepository<SqlzModel> {
  constructor() {
    super(SqlzModel)
  }
}
export const myRepositoryInstance = new MyRepository()
```

Le controller

```ts
import { Controller, DefaultActions, BeforeMiddleware, Post, Get, BodyFormat, Body } from '@bubojs/api'
import { myRepositoryInstance } from './MyRepository'

@Controller({ repository: myRepositoryInstance })
class DropController {}
```

Par mesure de securité aucune route automatique n'est construite par defaut, il faut activer celles dont vous avez besoin, pour cela il faut definir une par une les route en créant un champ dans le controller par ce bias :

```ts
import { Controller, DefaultActions, BeforeMiddleware, Post, Get, BodyFormat, Body } from '@bubojs/api'
import { myRepositoryInstance } from './MyRepository'

@Controller({ repository: myRepositoryInstance })
class BaseController 
{
    
    [DefaultActions.CREATE_ONE](){}
    [DefaultActions.UPDATE_ONE](){}
    [DefaultActions.GET_ONE]() {}
    [DefaultActions.GET_MANY]() {}
    [DefaultActions.DELETE_ONE]() {}
}
```

Ces routes créent une requete directe à la base de donnée, vous pouvez ajouter des options à cette requete via nos middleware dédiés (voir plus loin), ou ajouter vos propres options en les passant dans req.$sequelize ( ⚠️ attention à l'interaction entre plusieurs middlewares d'options)
Nous avons donc les routes suivantes :

- __POST__ /base/
- __PUT__ /base/:id
- __GET__ /base/:id
- __GET__ /base/
- __DELETE__ /base/:id

## Ajout d'une route custom ##

Une route custom s'ajoute via un decorateur :

```ts
import { Controller, DefaultActions, BeforeMiddleware, Post, Get, BodyFormat, Body } from '@bubojs/api'

@Controller()
class TestController 
{
  @Get('/hello_world')
  greetings(){
    return 'hello world'
  }
}
```

nous venons de créer une route qui renvoie __hello_world__ sur __address:port/test/hello_world__

### Passer des paramètres sur les routes custom ###

Pour passer des paramètres a vos fonctions sur les routes customs nous avons developpé des decorateurs permettant d'extraire les données de __req.query__, __req.params__, __req.body__ à l'aide de respectivement __@Query('fieldName')__, __@Params('paramName')__, __@Body('fieldName')__
exemple :

```ts
import { Controller, Post, Get, Body, Query } from '@bubojs/api'
@Controller()
class MyController
{
  @Get('/hello_world')
  greetings(@Query('username') username: string){
    return `hello ${username}`
  }
}
```

renverra __hello bubo__ sur le Get __{{api}}/drop/hello_world?username=bubo__

### Modifier le parser ###

Par defaut le parser des routes est sur __AUTO__ il va accepter tout les formats qu'il est capable de parser (RAW, TEXT, JSON, URL_ENCODED)
mais vous pouvez aussi forcer un format, les options sont :

- RAW
- TEXT
- JSON
- AUTO (parse avec la meilleure méthode indentifiée)
- SKIP (permet de ne pas parser le body dans le cas ou vous voulez mettre votre propre parser dans les middlewares)
- URL_ENCODED

exemple:

```ts
import { Controller, Post, Body, BodyFormat } from '@bubojs/api'
@Controller()
class MyController
{
  @Post('/test', { bodyFormat: BodyFormat.JSON })
  test(@Body('username') username: string){
    return `hello ${username}`
  }
}
```

Dans ce cas la route refusera tout ce qui n'est pas au format JSON

### Handler Brut ###

Quand vous construisez une route custom l'api buboJs va wrapper votre fonction pour récupérer son résultat et le stocker dans req.result, cela va permettre d'appeler d'autre middleware après afin d'effectuer des operation de formatage par exemple.
Vous pouvez cependant definir vous même le handler et gérer directement l'appel des middleware suivant (ou non), pour cela vous aller fournir au decorateur de la route custom non pas la fonction que vous voulez exectuter mais un constructeur du handler que vous voulez appeler, il faut aussi activer l'option __{rawHandler : true}__ dans le decorateur de la route
exemple :

```ts
import { Controller, Post, Body, BodyFormat } from '@bubojs/api'
@Controller()
class MyController
{
  @Get('/hello_world', { rawHandler: true, bodyFormat: BodyFormat.AUTO })
  builder() {
    return (req: any, res: any, next: Function) => {
      res.status(200).json(`hello ${req.query.username}`)
    }
  }
}
```

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

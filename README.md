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

## Ajout d'une route automatique ##

Pour construire une route automatique il faut fournir au controller un repository (actuellement uniquement sequelize est disponible)

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
class MyController 
{
  @Get('/hello_world')
  greetings(){
    return 'hello world'
  }
}
```

nous venons de créer une route qui renvoie __hello_world__ sur __address:port/my_controller/hello_world__

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
Vous pouvez cependant definir vous m^eme le handler et gérer directement l'appel des middleware suivant (ou non), pour cela vous aller fournir au decorateur de la route custom non pas la fonction que vous voulez exectuter mais un constructeur du handler que vous voulez appeler, il faut aussi activer l'option __{rawHandler : true}__ dans le decorateur de la route
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

Les validations sont construites avec [fatestValidator](https://github.com/icebob/) n'hesitez pas à regarder la documentation pour en savoir plus

### schema de validation ###

Vous pouvez utiliser le typage fournit par FastestValidator<Type> que permet de créer un schéma typé pour fastest ex :

```ts
const userCreateValidations: FastestValidator<User> = {
    schema: {
      $$async: true,
      username: { type: 'string', min: 3, max: 255 },
      email: { type: 'email', normalize: true },
      password: this.passwordValidation,
      birthDate: {
        optional: true,
        type: 'date',
        convert: true
      },,
      bio: { type: 'string', optional: true }
    },
    validatorOptions: {
      useNewCustomCheckerFunction: true, // using new version
      messages: {
        // Register our new error message text
        atLeastOneLetter: 'The pass value must contain at least one letter from a-z ranges!',
        atLeastOneUpperCaseLetter: 'The pass value must contain at least one letter from A-Z ranges!',
        atLeastOneDigit: 'The pass value must contain at least one digit from 0 to 9!',
        atLeastOneSpecialCharacter: 'The pass value must contain at least one special character!',
        emailNotAvailable: `The email is already registered!`
      }
    }
  }
```

### Ajout du schéma à la route ###

une fois le schéma créé il faut l'ajouter sur la route à valider, il y a un decorateur pour cela :

```ts
import { Body, Controller, Post } from '@bubojs/api'
import { AuthMiddleware, ValidationMiddleware } from '@bubojs/catalog'

@Controller()
class AuthController {
    @ValidationMiddleware(userCreateValidations)
    @Post('/signup')
    async signup(@Body() body: any) {
        ...
    }
}
```

le schéma s'ajoute à la route ainsi

## Upload de fichier ##

pour faire de l'Upload de fichier il vous faut tout d'abord une instance d'un objet storage **(actuellement seul firebase est supporté)**

### Instance de Storage ###

declaration d'une instance de storage (une seule par projet necessaire mais vous pouvez en ajouter autant que de besoin)

```ts
import { FirebaseInstance } from '../bubo.middlewares/uploader/Firebase'
import { env } from './constants'

export const firebase = new FirebaseInstance({
  bucketId: env.FIREBASE.bucketId,
  privateKey: env.FIREBASE.privateKey,
  clientEmail: env.FIREBASE.clientEmail,
  projectId: env.FIREBASE.projectId
})
```

### Placer l'uploader sur une route ###

```ts
import { Upload } from '../../bubo.middlewares/uploader'
import { firebase } from '../../config/Firebase'
import { Controller, DefaultActions, BeforeMiddleware, Post } from '@bubojs/api'

@Controller()
class TestController {

  @Upload(
    firebase,
    { folder: 'test_folder', keepName: false, preserveExtension: true },
    ['fieldOne', 'fieldTwo'],
    ['jpeg', 'png']
  )
  @Post('/')
  async testRoute() {
    console.log('uploaded files')
    return {}
  }

```

le Middleware Upload prend arguments :

1. l'instance de storage qui fournit les fonctions necessaires à l'accès au stockage
2. une liste d'options propres au storage:
    - folder permet de definir un dossier virtuel pour stocker les données
    - keepName permet de garder le nom d'origine du fichier ou d'en generer un avec nanoid
    - preserveExtension permet de conserver l'extension d'origine du fichier ou de ne pas mettre d'extension
3. le troisième argument permet de definir les noms de champs autorisés, si d'autres sont fournis la requete est refusée et une erreur est levée
4. le quatrieme argument definit la liste des extensions autorisées, si une extension n'est pas conforme la requete est refusée et part en erreur

une fois l'upload fait la clef de firebase du fichier uploadé est stocké dans le champ qui contenait le fichier dans le req.body, les autres champs sont copiés simplement dans le req.body

### Download le fichier ###

l'instance de l'uploader (firebase ici) prevoit une route de download, on utilise l'option rawHandler dans notre route custom pour pouvoir passer le constructeur du endpoint de telechargement
on renvoie ensuite depuis notre fonction builder le resultat de firebaseInstance.buildDownloadEndpoint.

La fonction prends deux parametres :
-> le cache avec maxAge qui est envoyé au header de reponse lors du telechargement
-> retrieveKeyCallback qui definit la fonction permettant de recupérer la clef firebase en fonction de ce qui est passé dans la requete

```ts
@Get(':id/image', { rawHandler: true, bodyFormat: BodyFormat.AUTO })
  dowloadImageBuilder() {
    return firebase.buildDownloadEndpoint({
      cache: { maxAge: 4 },
      retrieveKeyCallback: async (req: any) => {
        const img = await image.findOneByNoThrow('id', req.params.id)
        return image.fileKey
      }
    })
  }
```

## Authentification et droits ##

Pour gérer l'authentification actuellement seul JWT est disponible mais vous pouvez ajouter votre système d'authentification et d'autres seront ajoutés par la suite

En ce qui concerne les droits c'est la bibliothèque [role-acl](https://github.com/tensult/role-acl) qui est utilisée

### JWT Auth ###

Le middleware JwtAuth cherche un token dans le champ __Authorisation__ de la requete, s'il existe et est bien formaté le middleware remplira le champ req.user avec l'utilisateur identifié

le builder de middleware prend deux arguments :

- le secret token jwt
- Une fonction qui permet de recupérer l'utilisateur grace à l'id contenu dans le token

le middleware peut etre appliqué sur tous l'ensemble des routes:

```ts
import { TinyHttpAdapter } from '@bubojs/tinyhttp'
import { app, AppOptions } from '@bubojs/api'
import { JwtAuth } from './bubo.middlewares/Jwt/Jwt' // TODO Update

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

### RoleMiddleware ###

## Middleware Sequelize ##

### Attributes ###

Le decorateur __@SequelizeAttributes__ permet 3 choses :

- Definir des champs masqués pour tous les utilisateurs
- Definir des champs masqués en fonction de l'utilisateur courant
- Permettre au client de demander des champs particuliers dans sa requete au lieu de tout récupérer

Le decorateur prend 3 parametres :

- Le Modèle associé (permet de récupérer les différents champs)
- Un getter sur les Attributs Interdis  (()=>Array<string>|undefined)
- Un getter sur les Attributs Autorisés ((req:any)=> Array<string>|undefined)

exemple:

```ts
import { Controller, DefaultActions, Post, Body } from '@bubojs/api'
import { SequelizeAttributes } from '../../utils/middlewares/SequelizeAttributes.middleware'
import { AuthMiddleware, RoleMiddleware } from '@bubojs/catalog'

@Controller({ repository: userRepository })
export class UsersController {
  constructor() {
    applyUserAccessControlList()
  }

  @AuthMiddleware()
  @RoleMiddleware()
  @SequelizeAttributes(
    User,
    () => ['password'],
    (req: any) => {
      const attr = req.permission.attributes
      return attr === ['*'] ? undefined : attr
    }
  )
  [DefaultActions.GET_ONE]() {}
```

Dans cet exemple sur la route getOne des utilisateurs on a la configuration suivante:

- Aucun utilisateur ne peux avoir accès au champ password, cela permet d'etre sur qu'une donnée ne sort pas du serveur quelque soit les droits de l'utilisateur
- On récupère les données disponibles par utilisateur dans __req.permission.attributes__ (__req.permission__ est remplit par le __@RoleMiddleware__)
- Le client peut faire passer dans la query un champ __$attributes__ qui sera lu et peut permettre de selectionner les champs voulus, s'il ne sont pas dans une des listes d'exclusion ils seront ajoutés, si rien n'est précisé par le client tout est retourné

### Populate ###

L'option populate permet d'authoriser le client d'aggréger d'autres modèles liés au premier dans la base de donnée et ainsi retourner ces données supplémentaires en une seule requete sans avoir à refaire une autre requete

le decorateur prend deux parametres:

- le modele associé, cela permet de recupérer les associations possibles
- les chemins authorisés entre les Modèles

exemple :

Modèle __User__

```ts
import { Column, Default, Model, Table, HasOne } from 'sequelize-typescript'
import { DataTypes } from 'sequelize'
import { CircularHelper } from '@bubojs/sequelize'
import { Basket } from '../basket/Basket'

@Table({
  paranoid: true,
  tableName: 'user',
  underscored: true,
  timestamps: true
})
export class User extends Model {
  @Column({ type: DataTypes.STRING })
  declare username: string

  @Default(USERS_ROLES.PLAYER)
  @Column({ type: DataTypes.STRING })
  declare role: USERS_ROLES

  @Column({ type: DataTypes.STRING })
  declare password: string

  @HasOne(() => Basket)
  declare avatar: CircularHelper<Avatar>
```

Modèle __Basket__

```ts
import { Model, Column, DataType, HasMany, HasOne, ForeignKey, Table, BelongsTo } from 'sequelize-typescript'
import { CircularHelper } from '@bubojs/sequelize'
import { Product } from '../product/Product'
import { User } from '../user/User'

@Table({
  paranoid: true,
  timestamps: true,
  tableName: 'basket',
  underscored: true
})
export class Basket extends Model {

@Column({type: DataTypes.JSON})
declare content: Object

@ForeignKey(() => User)
@Column
declare userId: number

@BelongsTo(() => User)
declare user: CircularHelper<User>

@HasMany(()=> Product)
declare products: Array<CircularHelper<Product>>
}
```

Modèle __Product__

```ts
import { Model, Column, DataType, HasMany, HasOne, ForeignKey, Table, BelongsTo } from 'sequelize-typescript'
import { CircularHelper } from '@bubojs/sequelize'
import { Basket } from '../basket/Basket'

@Table({
  paranoid: true,
  timestamps: true,
  tableName: 'product',
  underscored: true
})
export class Product extends Model {

@Column({type: DataTypes.JSON})
declare content: Object

@ForeignKey(() => User)
@Column
declare userId: number

@BelongsTo(() => User)
declare user: CircularHelper<User>

@HasMany(()=> Product)
declare products: Array<CircularHelper<Product>>
}
```

Controleur __User__

```ts
import { AfterMiddleware, BeforeMiddleware, Controller, DefaultActions, Post, Body } from '@bubojs/api'
import { ValidationMiddleware, CurrentUser, AuthMiddleware, RoleMiddleware } from '@bubojs/catalog'
import { applyUserAccessControlList } from './UsersAccess'
import { User } from './User'
import { SequelizePopulate } from '../../bubo.middlewares/Sequelize/Populate.middleware'

@Controller({ repository: userRepository })
export class UsersController {
  constructor() {
    applyUserAccessControlList()
  }

  @AuthMiddleware()
  @RoleMiddleware()
  @SequelizePopulate(User, ['basket.product'])
  [DefaultActions.GET_ONE]() {}
}
```

## Middleware customs ##

Vous pouvez definir vos propres middlewares, ils peuvent ^etre appelés avant ou après l'execution de la route, pour les middleware qui s'executent après la route il n'y a pas besoin d'envoyer le resultat, cela peut etre fait automatiquement car bubo ajoute de lui meme un dernier middleware qui renvoi ce que se trouve dans __req.result__

les middlewares sont executés dans le meme ordre que celui d'ajout dans le code (celui le plus haut au dessus de la route sera executé en premier)

### Before Middleware ###

TODO trouver exemple

### After Middleware ###

TODO Trouver exemple

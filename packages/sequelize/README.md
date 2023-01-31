# Middlewares Sequelize #

[Back to Main Menu](../../README.md)

## Attributes ##

Le décorateur __@SequelizeAttributes__ permet 3 choses :

- Définir des champs masqués pour tous les utilisateurs
- Définir des champs masqués en fonction de l'utilisateur courant
- Permettre au client de demander des champs particuliers dans sa requete au lieu de tout récupérer

Le décorateur prend 3 paramètres :

- Le Modèle associé (permet de récupérer les différents champs)
- Un getter sur les Attributs Interdis  (()=>Array<string>|undefined)
- Un getter sur les Attributs Autorisés ((req:any)=> Array<string>|undefined)

exemple:

```ts
import { Controller, DefaultActions, Post, Body } from '@bubojs/api'
import { SequelizeAttributes } from '../../utils/middlewares/SequelizeAttributes.middleware'
import { AuthMiddleware, RoleMiddleware } from '@bubojs/catalog'
import { userAcl } from './UserAcl'

@Acl(userAcl)
@Controller({ repository: userRepository })
export class UsersController {
  constructor() {
    applyUserAccessControlList()
  }

  @AuthMiddleware()
  @CheckAcl()
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

## Populate ##

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
import { userAcl } from './UserAcl'
import { SequelizePopulate } from '../../bubo.middlewares/Sequelize/Populate.middleware'

@Acl(userAcl)
@Controller({ repository: userRepository })
export class UsersController {

  @AuthMiddleware()
  @CheckAcl()
  @SequelizePopulate(User, ['basket.product'])
  [DefaultActions.GET_ONE]() {}
}
```

[Back To Main Menu](../../README.md#gestion-des-bases-de-données)

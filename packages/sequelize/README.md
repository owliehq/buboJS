<p align="center">
  <a href="https://github.com/owliehq/buboJS/tree/develop">
    <img src="https://owlie.xyz/bubo/bubo-js.png">
  </a>
</p>

## Middlewares Sequelize ##

[![sequelize](https://img.shields.io/npm/v/@bubojs/sequelize?label=sequelize)](https://www.npmjs.com/package/@bubojs/sequelize)

[Back to Main Menu](../../README.md#database-management)

### Attributes ###

The __@SequelizeAttributes__ decorator allows 3 things:

- Define hidden fields for all users
- Define hidden fields based on the current user
- Allow the client to request particular fields in its request instead of retrieving everything

The decorator takes 3 parameters:

- The associated Model (allows to retrieve the different fields)
- A getter on the Interdis Attributes (()=>Array<string>|undefined)
- A getter on the Authorized Attributes ((req:any)=> Array<string>|undefined)

example:

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

In this example on the getOne route of the users we have the following configuration:

- No user can have access to the password field, this allows to be sure that a data does not go out of the server whatever the user rights are
- We get the available data per user in __req.permission.attributes__ (__req.permission__ is filled by the __@CheckAcl__)
- The client can pass in the query a __$attributes__ field which will be read and can allow to select the desired fields, if they are not in one of the exclusion lists they will be added, if nothing is specified by the client everything is returned

### Populate ###

The populate option allows the client to aggregate other models related to the first one in the database and return these additional data in a single query without having to make another query

the decorator takes two parameters:

- the associated Model, this allows to retrieve the possible associations
- the authorized paths between the Models

example:

Model __User__

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

Model __Basket__

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

Model __Product__

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

[Back To Main Menu](../../README.md#database-management)

## Editor ##

<p>
  <a href="https://www.owlie.xyz">
    <img style="border-radius:50%" width="100" height="100" src="https://www.owlie.xyz/bubo/owlielogo.png">
  </a>
</p>
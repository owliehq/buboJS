# Acl Middleware #

[Back to Main Menu](../../README.md#rights)

the Acl Set (Access Control List) allows to define the rights of each type of user, it is based on the library [role-acl](https://github.com/tensult/role-acl)
The Set provided by bubo is composed of 2 functions and 2 middlewares 

## Acl ##

This decorator is placed on a controller class, it allows to assign all the rules that can be used on the controller in question

Example of a configuration object

```ts

import { DefaultActions } from '@bubojs/api'
import { UsersRepository } from './UsersRepository'
import { Right } from '@bubojs/catalog'

const usersRepository = new UsersRepository()

const userDefaultAccess = async (context: any) => {
  const { id } = context.params
  const userId = context.user.id
  const user = await usersRepository.findOneBy('id', id)
  return user.id === userId
}

export const userRights: Array<Omit<Right, 'resource'>> = [
  {
    role: 'admin',
    action: [
      DefaultActions.GET_MANY,
      DefaultActions.GET_ONE,
      DefaultActions.CREATE_ONE,
      DefaultActions.UPDATE_ONE,
      DefaultActions.DELETE_ONE,
      'checkPhone'
    ]
  },
  {
    role: 'regular',
    action: [DefaultActions.GET_ONE, DefaultActions.UPDATE_ONE, DefaultActions.DELETE_ONE],
    attributes: ['username', 'id', 'birthDate', 'email', 'gender', 'bio', 'phone'],
    condition: userDefaultAccess
  }
]
```

We define the possible actions for each role, the attributes to which they have access (this can be used for example for the attributes of sequelize) as well as the particular conditions to be fulfilled (here for example a classic user can only access himself and not the others)

On the controller:

```ts
import {Controller } from '@bubojs/api'
import { userRights } from './UsersAccess'
import { userValidation } from './UsersValidation'
import { userRepository } from '../../repositories'
import { User } from './User'
import { Acl } from '@bubojs/catalog'

@Acl(userRights)
@Controller({ repository: userRepository })
export class UsersController {
}
```

## CheckAcl ##

This decorator is put on a route in order to activate the rights validation middleware for it, if the route is not defined in the rights then the route is systematically refused

```ts
import { Controller, DefaultActions } from '@bubojs/api'
import { AuthMiddleware } from '@bubojs/catalog'
import { userRights } from './UsersAccess'
import { userRepository } from '../../repositories'
import { User } from './User'
import { SequelizeAttributes } from '../../utils/middlewares/SequelizeAttributes.middleware'
import { Acl, CheckAcl } from '@bubojs/catalog'

@Acl(userRights)
@Controller({ repository: userRepository })
export class UsersController {
   @AuthMiddleware()
   @CheckAcl()
   @SequelizeAttributes(
           User,
           () => undefined,
           (req: any) => {
              const attr = req.permission.attributes
              return attr === ['*'] ? undefined : attr
           }
   )
   [DefaultActions.GET_ONE]() {
   }

   @AuthMiddleware()
   @CheckAcl()
   [DefaultActions.GET_MANY]() {
   }

   @AuthMiddleware()
   @CheckAcl()
   @SequelizeAttributes(
           User,
           () => undefined,
           (req: any) => {
              const attr = req.permission.attributes
              return attr === ['*'] ? undefined : attr
           }
   )
   [DefaultActions.CREATE_ONE]() {
   }

   @AuthMiddleware()
   @CheckAcl()
   @SequelizeAttributes(
           User,
           () => undefined,
           (req: any) => {
              const attr = req.permission.attributes
              return attr === ['*'] ? undefined : attr
           }
   )
   [DefaultActions.UPDATE_ONE]() {
   }

   @AuthMiddleware()
   @CheckAcl()
   [DefaultActions.DELETE_ONE]() {
   }
}
```

This decorator is put on a route in order to activate the rights validation middleware for it, if the route is not defined in the rights then the route is systematically refused

## AclManager ##

Two functions are available on AclManager:

__AclManager.applyRights__ which must be called to apply the rights in the manager, ideally just after the server startup once all controllers are registered

__AclManager.roleCallback__ allows to redefine the role getter for a user, by default it will retrieve the "role" field

[Back to Main Menu](../../README.md#rights)

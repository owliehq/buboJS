# Acl Middleware #

[Back to Main Menu](../../README.md)

le Set Acl (Access Control List) permet de définir les droits de chaque type d'utilisateur, il est basé sur la bibliothèque [role-acl](https://github.com/tensult/role-acl)
Le Set fournit par bubo se compose de 2 fonctions et 2 middlewares 

## Acl ##

Ce décorateur se place sur une classe controller, il permet d'assigner l'ensemble des règles utilisables sur le controlleur en question

Exemple d'objet de configuration

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

On définit les actions possibles pour chaque role, les attributs auquel ils ont accès (cela peut servir par exemple pour les attributs de sequelize) ainsi que les conditions particulières à remplir (ici par exemple un utilisateur classique ne peut accéder qu'a lui meme et pas aux autres)

Sur le controlleur :

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

Ce décorateur se met sur une route afin d'activer le middleware de validation des droits pour celle-ci, si la route n'est pas définit dans les droits alors la route est systématiquement refusée

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

On voit ici un exemple d'utilisation des Attributs, une fois le middleware Acl passé req obtient un champ permission qui permet d'avoir les informations sur les droits de l'utilisateur et de les utiliser plus loin

## AclManager ##

Deux fonctions sont disponibles sur AclManager:

__AclManager.applyRights__ qui doit etre appelée pour appliquée les droits dans le manager, idéalement juste après le démarrage du serveur une fois que toutes les controlleurs sont enregistrés

__AclManager.roleCallback__ permet de redefinir le getter de roles pour un utilisateur, par defaut il va récupérer le champ "role"

[Back to Main Menu](../../README.md)

import { AccessControl } from 'role-acl'
import { toSnakeCase } from '../utils/snakeCase'
import { ErrorFactory } from '@bubojs/http-errors'
import { MetadataManager, MiddlewarePosition } from '@bubojs/api'
import * as pluralize from 'pluralize'

export interface Right {
  resource: string
  role: any
  action: string | Array<string>
  attributes?: string | Array<string>
  condition?: Function
}

export class RightsManager {
  private static acl = new Array<Right>()
  private static accessController = new AccessControl()
  private static roleGetter: Function = (user: any) => user.role

  static roleCallback(getter: (user: any) => string) {
    RightsManager.roleGetter = getter
  }

  static addRight(right: Right | Array<Right>) {
    const pushOne = (r: Right) => {
      const { resource, role, action, attributes, condition } = r
      RightsManager.acl.push({ resource, role, action, attributes: attributes ?? ['*'], condition })
    }
    if (Array.isArray(right)) {
      right.forEach(r => pushOne(r))
    } else {
      pushOne(right)
    }
  }

  static applyRights() {
    RightsManager.accessController.setGrants(RightsManager.acl)
  }

  static getRole(user: any) {
    return RightsManager.roleGetter(user)
  }

  static getMiddleware(resource: string, action: string, prepareContext?: Function) {
    const middleware = async (req: any, res: any, next: Function): Promise<void> => {
      const user = req.user as any

      if (!user) throw Error(`You have not called AuthMiddleware before this one (RoleMiddleware).`)

      const role = await RightsManager.getRole(user)

      if (!role) throw Error(`There's an error with user's role, maybe the callback is not set correctly.`)

      if (!RightsManager.accessController.getRoles().includes(role))
        throw ErrorFactory.Forbidden({
          message: `You don't have the right ACL to execute this action on optional requested resource.`
        })

      const permission = await RightsManager.accessController
        .can(role)
        .context({
          body: req.body,
          params: req.params,
          user,
          custom: prepareContext ? await prepareContext(req) : undefined
        })
        .execute(action)
        .on(resource)

      if (!permission.granted)
        throw ErrorFactory.Forbidden({
          message: `You don't have the right ACL to execute this action on optional requested resource.`
        })
      req.permission = permission
      next()
    }
    return middleware
  }
}

export const Acl = (rights: Array<Omit<Right, 'resource'>>) => (constructor: any) => {
  const resource = pluralize.plural(constructor.name.replace('Controller', '').toSnakeCase()) //must match route name
  const rightsFull = rights.reduce((list, r) => {
    const { role, action, attributes, condition } = r
    list.push({ resource, action, attributes: attributes ?? ['*'], condition, role })
    return list
  }, new Array<Right>())
  RightsManager.addRight(rightsFull)
}

export const CheckAcl =
  (customContext?: (req: any) => any) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const name = target.constructor.name
    const isController = name?.includes('Controller')
    if (!isController) throw new Error(`Controller name's must finish with "Controller"`)

    const resource = name.replace('Controller', '').toSnakeCase()

    const currentRoleMiddleware = RightsManager.getMiddleware(resource, propertyKey, customContext)

    MetadataManager.setMiddlewareMetadata(
      target.constructor.name,
      propertyKey,
      MiddlewarePosition.BEFORE,
      currentRoleMiddleware
    )
  }

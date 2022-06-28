import { MetadataManager, MiddlewarePosition } from '../../../api/src'
import { RightsManager } from '../../../api/src/RightsManager'
import { HttpError } from '../../../http-errors/src'

export const roleMiddleware = (resource: string, action: string, prepareContext?: Function) => {
  const callback = async (req: any, res: any, next: Function): Promise<void> => {
    const user = req.user as any

    if (!user) throw Error(`You have not called AuthMiddleware before this one (RoleMiddleware).`)

    const role = await RightsManager.getRole(user)

    if (!role) throw Error(`There's an error with user's role, maybe the callback is not set correctly.`)

    if (!RightsManager.accessController.getRoles().includes(role))
      throw HttpError.Forbidden({
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
      throw HttpError.Forbidden({
        message: `You don't have the right ACL to execute this action on optional requested resource.`
      })

    next()
  }
  return callback
}

export const RoleMiddleware = () => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const name = target.constructor.name

    const isController = name?.substring(name.length - 10) === 'Controller'

    if (!isController) throw new Error(`Controller name's must finish with "Controller"`)

    const resource = name.substring(0, name.length - 10).toLowerCase()

    const currentRoleMiddleware = roleMiddleware(resource, propertyKey)

    MetadataManager.setMiddlewareMetadata(
      target.constructor.name,
      propertyKey,
      MiddlewarePosition.BEFORE,
      currentRoleMiddleware
    )
  }
}

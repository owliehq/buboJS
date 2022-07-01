import { DefaultActions, MetadataManager } from '@owliehq/bubojs/packages/api'
import { RightsManager } from '@owliehq/bubojs/packages/api'
import { ROLES } from '../../config/constants'
import { UsersService } from './UsersService'

const usersService = MetadataManager.getServiceMetadata(UsersService)

export const applyUserAccessControlList = () => {
  // Same name than controller class
  const rightsManager = new RightsManager('users')

  rightsManager.addRight(ROLES.ADMIN, [
    DefaultActions.GET_MANY,
    DefaultActions.GET_ONE,
    DefaultActions.CREATE_ONE,
    DefaultActions.UPDATE_ONE,
    DefaultActions.DELETE_ONE,
    'checkEmail'
  ])

  rightsManager.addRight(ROLES.USER, ['checkEmail'])

  rightsManager.addRight(
    ROLES.USER,
    [DefaultActions.GET_ONE, DefaultActions.UPDATE_ONE, DefaultActions.DELETE_ONE],
    ['*'],
    userDefaultAccess
  )

  RightsManager.registerRightsController(rightsManager)
}

const userDefaultAccess = async (context: any) => {
  const { id } = context.params
  const userId = context.user.id

  const user = await usersService.findUserById(id)

  return user.id === userId
}

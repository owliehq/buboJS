import { DefaultActions } from '../../../../../packages/api/src'
import { RightsManager } from '../../../../../packages/api/src/RightsManager'
import { ROLES } from '../../config/constants'

export const applyTaskAccessControlList = () => {
  // Same name than controller class
  const rightsManager = new RightsManager('tasks')

  rightsManager.addRight(ROLES.ADMIN, [
    DefaultActions.GET_MANY,
    DefaultActions.GET_ONE,
    DefaultActions.CREATE_ONE,
    DefaultActions.UPDATE_ONE,
    DefaultActions.DELETE_ONE
  ])

  rightsManager.addRight(ROLES.USER, [
    DefaultActions.GET_MANY,
    DefaultActions.GET_ONE,
    DefaultActions.CREATE_ONE,
    DefaultActions.UPDATE_ONE,
    DefaultActions.DELETE_ONE
  ])

  RightsManager.registerRightsController(rightsManager)
}

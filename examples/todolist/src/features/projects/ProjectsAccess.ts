import { DefaultActions, RightsManager } from '@bubojs/api'
import { ROLES } from '../../config/constants'

export const applyProjectAccessControlList = () => {
  // Same name than controller class
  const rightsManager = new RightsManager('projects')

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

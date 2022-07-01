import {
  AfterMiddleware,
  BeforeMiddleware,
  Controller,
  DefaultActions,
  MetadataManager
} from '@owliehq/bubojs/packages/api'
import { ValidationMiddleware } from '@owliehq/bubojs/packages/catalog'
import { AuthMiddleware } from '@owliehq/bubojs/packages/catalog'
import { RoleMiddleware } from '@owliehq/bubojs/packages/catalog'
import { Positions } from '../user_projects/UserProject'
import { UserProjectsService } from '../user_projects/UserProjectsService'
import { applyProjectAccessControlList } from './ProjectsAccess'
import { ProjectsRepository } from './ProjectsRepository'
import { createValidations, deleteValidations, updateValidations } from './ProjectsValidations'

const projectsRepository = new ProjectsRepository()
@Controller('projects', { repository: projectsRepository })
export class ProjectsController {
  constructor() {
    applyProjectAccessControlList()
  }

  @AuthMiddleware()
  @RoleMiddleware()
  [DefaultActions.GET_ONE]() {}

  @AuthMiddleware()
  @RoleMiddleware()
  [DefaultActions.GET_MANY]() {}

  @AuthMiddleware()
  @RoleMiddleware()
  @ValidationMiddleware(createValidations)
  @AfterMiddleware((req: any, res: any, next: Function) => {
    const userProjectsService = MetadataManager.getServiceMetadata(UserProjectsService)
    userProjectsService.createUserProject(req.user.id, req.result.id, Positions.manager)
    next()
  })
  [DefaultActions.CREATE_ONE]() {}

  @AuthMiddleware()
  @RoleMiddleware()
  @ValidationMiddleware(updateValidations)
  [DefaultActions.UPDATE_ONE]() {}

  @AuthMiddleware()
  @RoleMiddleware()
  @BeforeMiddleware(deleteValidations)
  [DefaultActions.DELETE_ONE]() {}
}

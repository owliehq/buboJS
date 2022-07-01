import { BeforeMiddleware, Controller, DefaultActions } from '@owliehq/bubojs/packages/api'
import { ValidationMiddleware, AuthMiddleware, RoleMiddleware } from '@owliehq/bubojs/packages/catalog'
import { applyTaskAccessControlList } from './TasksAccess'
import { TasksRepository } from './TasksRepository'
import { createValidations, deleteValidations, updateValidations } from './TasksValidations'

const tasksRepository = new TasksRepository()
@Controller('tasks', { repository: tasksRepository })
export class TasksController {
  constructor() {
    applyTaskAccessControlList()
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

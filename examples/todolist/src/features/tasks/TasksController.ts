import { BeforeMiddleware, Controller, DefaultActions } from '../../../../../packages/api/src'
import { ValidationMiddleware } from '../../../../../packages/catalog/src/middlewares'
import { AuthMiddleware } from '../../../../../packages/catalog/src/middlewares/AuthMiddleware'
import { RoleMiddleware } from '../../../../../packages/catalog/src/middlewares/RoleMiddleware'
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

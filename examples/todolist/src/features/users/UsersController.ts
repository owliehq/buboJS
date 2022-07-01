import { AfterMiddleware, BeforeMiddleware, Controller, DefaultActions, Get, Inject, Query } from '@bubojs/api'
import { AuthMiddleware, RoleMiddleware, ValidationMiddleware } from '@bubojs/catalog'
import { applyUserAccessControlList } from './UsersAccess'
import { UsersRepository } from './UsersRepository'
import { UsersService } from './UsersService'
import {
  checkEmailValidations,
  createValidations,
  deleteValidations,
  removePassword,
  removePasswords,
  updateValidations
} from './UsersValidations'

const usersRepository = new UsersRepository()
@Controller('users', { repository: usersRepository })
export class UsersController {
  constructor() {
    applyUserAccessControlList()
  }

  @Inject usersService: UsersService

  @AuthMiddleware()
  @RoleMiddleware()
  @ValidationMiddleware(checkEmailValidations)
  @Get('/exists/by')
  async checkEmail(@Query('email') email: any) {
    const exists = await this.usersService.checkEmailExistence(email)
    return { exists }
  }

  @AuthMiddleware()
  @RoleMiddleware()
  @AfterMiddleware(removePassword)
  [DefaultActions.GET_ONE]() {}

  @AuthMiddleware()
  @RoleMiddleware()
  @AfterMiddleware(removePasswords)
  [DefaultActions.GET_MANY]() {}

  @AuthMiddleware()
  @RoleMiddleware()
  @ValidationMiddleware(createValidations)
  @AfterMiddleware(removePassword)
  [DefaultActions.CREATE_ONE]() {}

  @AuthMiddleware()
  @RoleMiddleware()
  @ValidationMiddleware(updateValidations)
  @AfterMiddleware(removePassword)
  [DefaultActions.UPDATE_ONE]() {}

  @AuthMiddleware()
  @RoleMiddleware()
  @BeforeMiddleware(deleteValidations)
  @AfterMiddleware(removePassword)
  [DefaultActions.DELETE_ONE]() {}
}

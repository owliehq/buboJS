import {
  AfterMiddleware,
  BeforeMiddleware,
  Controller,
  DefaultActions,
  Get,
  Inject,
  Query
} from '../../../../../packages/api/src'
import { ValidationMiddleware } from '../../../../../packages/catalog/src/middlewares'
import { UserRepository } from './UserRepository'
import { UsersService } from './UsersService'
import {
  checkEmailValidations,
  createValidations,
  deleteValidations,
  removePassword,
  removePasswords,
  updateValidations
} from './UsersValidation'

const userRepository = new UserRepository()
@Controller('users', { repository: userRepository })
export class UsersController {
  @Inject usersService: UsersService

  @ValidationMiddleware(checkEmailValidations)
  @Get('/exists/by')
  async checkEmail(@Query('email') email: any) {
    const exists = await this.usersService.checkEmailExistence(email)
    return { exists }
  }

  @AfterMiddleware(removePassword)
  [DefaultActions.GET_ONE]() {}

  @AfterMiddleware(removePasswords)
  [DefaultActions.GET_MANY]() {}

  @ValidationMiddleware(createValidations)
  @AfterMiddleware(removePassword)
  [DefaultActions.CREATE_ONE]() {}

  @ValidationMiddleware(updateValidations)
  @AfterMiddleware(removePassword)
  [DefaultActions.UPDATE_ONE]() {}

  @BeforeMiddleware(deleteValidations)
  @AfterMiddleware(removePassword)
  [DefaultActions.DELETE_ONE]() {}
}

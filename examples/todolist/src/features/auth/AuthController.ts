import { AfterMiddleware, Body, Controller, Inject, Post } from '../../../../../packages/api/src'
import { ValidationMiddleware } from '../../../../../packages/catalog/src/middlewares'
import { HttpError } from '../../../../../packages/http-errors/src'
import { UsersService } from '../users/UsersService'
import { createValidations, removePassword } from '../users/UsersValidation'
import { AuthService } from './AuthService'
import { checkLoginValidations } from './AuthValidation'

@Controller('auth')
export class AuthController {
  @Inject authService: AuthService
  @Inject userService: UsersService

  @ValidationMiddleware(createValidations)
  @AfterMiddleware(removePassword)
  @Post('/signup')
  async signup(@Body body: any) {
    try {
      const user = await this.userService.createUser(body)
      return user
    } catch (error) {
      return HttpError.BadRequest({ message: 'Invalid credentials' })
    }
  }

  @ValidationMiddleware(checkLoginValidations)
  @Post('/login')
  async login(@Body body: any) {
    const { email, password } = body
    try {
      const user = await this.userService.findUserByEmail(email)
      await this.userService.checkPasswordFromUser(user, password)
      const tokens = await this.authService.createTokens(user)
      return tokens
    } catch (error) {
      console.error(error)
      return HttpError.BadRequest({ message: 'Invalid credentials' })
    }
  }
}

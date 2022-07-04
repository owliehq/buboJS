import { AfterMiddleware, Body, Controller, Inject, Post } from '@bubojs/api'
import { ValidationMiddleware } from '@bubojs/catalog'
import { HttpError } from '@bubojs/http-errors'
import { UsersService } from '../users/UsersService'
import { removePassword } from '../users/UsersValidations'
import { AuthService } from './AuthService'
import { checkLoginValidations, createValidations } from './AuthValidations'

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
      throw HttpError.BadRequest({ message: 'Invalid credentials' })
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
      throw HttpError.BadRequest({ message: 'Invalid credentials' })
    }
  }
}

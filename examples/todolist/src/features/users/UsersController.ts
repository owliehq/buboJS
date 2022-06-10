import { Body, Controller, DefaultActions, Get } from '../../../../../packages/api/src'
import { User } from './User'
import { UserRepository } from './UserRepository'

const userRepository = new UserRepository()
@Controller('users', { repository: userRepository })
export class UsersController {
  @Get('/checkEmail')
  async checkEmail(@Body body: any) {
    // User.create({ firstName: 'Nønø88' })
    // const user = await User.findAll({ where: {} })
    // console.log('user', user)
    // const { email } = body
    // const user = await this.userService.checkEmailAvailability(email)
    const user = null
    return { emailAvailable: user ? false : true }
  }

  [DefaultActions.GET_ONE]() {}

  [DefaultActions.GET_MANY]() {}

  [DefaultActions.CREATE_ONE]() {}

  [DefaultActions.UPDATE_ONE]() {}

  [DefaultActions.DELETE_ONE]() {}
}

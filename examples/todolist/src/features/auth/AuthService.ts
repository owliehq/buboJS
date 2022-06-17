import { Transaction } from 'sequelize/types'
import { Inject, Service } from '../../../../../packages/api/src'
import { TokenService } from '../../services/TokenService'
import { User } from '../users/User'
import { UsersService } from '../users/UsersService'

@Service()
export class AuthService {
  @Inject tokenService: TokenService

  @Inject userService: UsersService

  async createTokens(user: User, transaction?: Transaction) {
    const { id, email } = user

    const accessToken = this.tokenService.createAccessToken({ id, email })
    const refreshToken = await this.tokenService.createRefreshToken('login', id, transaction)

    return { accessToken, refreshToken }
  }
}

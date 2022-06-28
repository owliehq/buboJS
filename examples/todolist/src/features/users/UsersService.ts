import { Service } from '../../../../../packages/api/src'
import { User } from './User'
import * as bcrypt from 'bcrypt'
import { PASSWORD_SALT_ROUND } from '../../config/constants'

@Service()
export class UsersService {
  // TODO generate password

  async checkEmailExistence(email: string) {
    const user = await User.findOne({ where: { email } })
    if (user) return true
    return false
  }

  async findUserById(id: string) {
    const user = await User.findOne({ where: { id } })
    if (!user) throw new Error('User not found')
    return user
  }

  async findUserByEmail(email: string) {
    const user = await User.findOne({ where: { email } })
    if (!user) throw new Error('User not found')
    return user
  }

  async checkPasswordFromUser(user: User, rawPassword: string) {
    const { password } = user
    if (!password) throw new Error('No password')
    const isSamePassword = bcrypt.compareSync(rawPassword, password)
    if (!isSamePassword) throw new Error('Invalid password')
    return user
  }

  generatePassword(password: string) {
    const salt = bcrypt.genSaltSync(parseInt(PASSWORD_SALT_ROUND))
    return bcrypt.hashSync(password, salt)
  }

  async createUser(payload: any) {
    if (payload.password) payload.password = await this.generatePassword(payload.password)
    const user = await User.create(payload)
    return user
  }
}

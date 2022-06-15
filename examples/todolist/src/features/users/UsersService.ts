import { Service } from '../../../../../packages/api/src'
import { User } from './User'

@Service()
export class UsersService {
  // TODO generate password

  async checkEmailExistence(email: string) {
    const user = await User.findOne({ where: { email } })
    if (user) return true
    return false
  }

  async findUserByUser(id: string) {
    const user = await User.findOne({ where: { id } })
    if (!user) throw new Error('User not found')
    return user
  }
}

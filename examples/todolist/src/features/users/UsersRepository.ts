import { SequelizeBaseRepository } from '../../SequelizeBaseRepository'
import { User } from './User'

export class UsersRepository extends SequelizeBaseRepository<User> {
  constructor() {
    super(User)
  }
}

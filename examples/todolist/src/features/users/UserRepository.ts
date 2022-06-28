import { SequelizeBaseRepository } from './SequelizeBaseRepository'
import { User } from './User'

export class UserRepository extends SequelizeBaseRepository<User> {
  constructor() {
    super(User)
  }
}

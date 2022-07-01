import { SequelizeBaseRepository } from '@bubojs/sequelize'
import { User } from './User'

export class UsersRepository extends SequelizeBaseRepository<User> {
  constructor() {
    super(User)
  }
}

import { SequelizeBaseRepository } from '@owliehq/bubojs/packages/sequelize'
import { User } from './User'

export class UsersRepository extends SequelizeBaseRepository<User> {
  constructor() {
    super(User)
  }
}

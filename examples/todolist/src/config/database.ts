import { Sequelize, SequelizeOptions } from 'sequelize-typescript'
import { RefreshToken } from '../features/auth/RefreshToken'
import { Project } from '../features/projects/Project'
import { Task } from '../features/tasks/Task'
import { User } from '../features/users/User'
import { UserProject } from '../features/user_projects/UserProject'

export const startDatabase = async () => {
  const sequelizeConfig: SequelizeOptions = {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: false,
    dialectOptions: {}
  }

  const sequelize = new Sequelize('todolist', 'todolist', 'todolist', sequelizeConfig)
  sequelize.addModels([Project, RefreshToken, Task, User, UserProject])

  const sequelizeOptions = { alter: true, force: false }
  await sequelize.authenticate()
  const result = await sequelize.sync(sequelizeOptions)
}

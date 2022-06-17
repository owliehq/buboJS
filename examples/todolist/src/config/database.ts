import { Sequelize, SequelizeOptions } from 'sequelize-typescript'
import { RefreshToken } from '../features/auth/RefreshToken'
import { User } from '../features/users/User'

export const startDatabase = async () => {
  const sequelizeConfig: SequelizeOptions = {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: false,
    dialectOptions: {}
  }

  const sequelize = new Sequelize('todolist', 'todolist', 'todolist', sequelizeConfig)
  sequelize.addModels([RefreshToken, User])

  const sequelizeOptions = { alter: true, force: false }
  await sequelize.authenticate()
  const result = await sequelize.sync(sequelizeOptions)
}

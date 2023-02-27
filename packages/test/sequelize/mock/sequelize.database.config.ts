import { Sequelize, SequelizeOptions } from 'sequelize-typescript'
import { User, Task, Project, UserProject } from '../models/models'

const sequelizeConfig: SequelizeOptions = {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
  logging: false,
  dialectOptions: {}
}
export const sequelize = new Sequelize('BuboMockDb', 'Bubo', 'Bubo', sequelizeConfig)
sequelize.addModels([User, Task, Project, UserProject])

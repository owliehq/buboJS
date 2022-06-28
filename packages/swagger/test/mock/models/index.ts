import { AssociationMetadata, ColumnMetadata, MetadataManager } from '@bubojs/api'
import { setProperty } from 'dot-prop'
import { Repository, Sequelize, SequelizeOptions } from 'sequelize-typescript'
import { Project } from './Project'
import { Task } from './Task'
import { User } from './User'
import { UserProject } from './UserProject'

export * from './Project'
export * from './Task'
export * from './User'
export * from './UserProject'

const sequelizeConfig: SequelizeOptions = {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
  logging: false,
  dialectOptions: {}
}
export const sequelize = new Sequelize('BuboMockDb', 'Bubo', 'Bubo', sequelizeConfig)
export const models: Repository<any>[] = [User, Task, Project, UserProject]
sequelize.addModels(models)

export async function initMockDb() {
  const sequelizeOptions = { alter: true, force: true }
  await sequelize.authenticate()
  const result = await sequelize.sync(sequelizeOptions)

  models.forEach(model => {
    const tableName = model.getTableName()
    let name: string = ''
    if (typeof tableName === 'string') name = tableName
    else name = tableName.tableName

    let associations: { [id: string]: AssociationMetadata } = {}
    const columns: { [id: string]: ColumnMetadata } = {}

    Object.entries(model.getAttributes()).forEach(([key, attribute]) => {
      const metadata: ColumnMetadata = {
        type: attribute.type.toString({}),
        allowNull: attribute.allowNull,
        primaryKey: attribute.primaryKey,
        field: attribute.field
      }
      setProperty(columns, key, metadata)
    })

    Object.entries(model.associations).forEach(([key, association]) => {
      const attribute = association.as,
        associationType = association.associationType,
        attributeType = association.target.name,
        attributeTableName = association.target.getTableName()
      setProperty(associations, key, { attribute, associationType, attributeType, attributeTableName })
    })

    MetadataManager.setModelMetadata(name, {
      name,
      columns,
      associations
    })
  })
}

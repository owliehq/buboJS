import { Column, HasMany, Model, Table } from 'sequelize-typescript'
import { CircularHelper } from '../TypeUtils'
import { Task, UserProject } from './models'

@Table({
  tableName: 'project',
  paranoid: false,
  timestamps: true,
  underscored: true
})
export class Project extends Model {
  @Column
  declare name: string

  @Column
  declare description: string

  @HasMany(() => UserProject)
  declare userProjects: CircularHelper<UserProject>[]

  @HasMany(() => Task)
  declare tasks: CircularHelper<Task>[]
}

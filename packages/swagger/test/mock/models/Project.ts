import { CircularHelper } from '@bubojs/sequelize'
import { Column, HasMany, Model, Table } from 'sequelize-typescript'
import { Task, UserProject } from '.'

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

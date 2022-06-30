import { BeforeDestroy, Column, HasMany, Model, Table } from 'sequelize-typescript'
import { CircularHelper } from '../../utils/TypeUtils'
import { Task } from '../tasks/Task'
import { UserProject } from '../user_projects/UserProject'

@Table({
  tableName: 'project',
  paranoid: true,
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

  @BeforeDestroy
  static async destroyUserProject(instance: Project, options: any) {
    const { id } = instance
    const { transaction } = options
    options.where = { projectId: id }
    UserProject.destroy({ where: { projectId: id }, transaction })
  }
}

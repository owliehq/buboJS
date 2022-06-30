import { AllowNull, Column, Default, HasMany, Model, Table } from 'sequelize-typescript'
import { ROLES } from '../../config/constants'
import { CircularHelper } from '../../utils/TypeUtils'
import { Task } from '../tasks/Task'
import { UserProject } from '../user_projects/UserProject'

@Table({
  tableName: 'users',
  underscored: true,
  paranoid: true,
  timestamps: true
})
export class User extends Model {
  @Column
  declare firstName: string

  @Column
  declare lastName: string

  @Column
  declare password: string

  @Column
  declare email: string

  @Default(ROLES.USER)
  @AllowNull(false)
  @Column
  declare role: ROLES

  @HasMany(() => UserProject)
  declare projects: CircularHelper<UserProject>[]

  @HasMany(() => Task)
  declare tasks: CircularHelper<Task>[]
}

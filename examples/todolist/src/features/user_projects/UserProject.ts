import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { CircularHelper } from '../../utils/TypeUtils'
import { Project } from '../projects/Project'
import { User } from '../users/User'

export enum Positions {
  manager = 'manager',
  worker = 'worker',
  viewer = 'viewer'
}

@Table({
  tableName: 'user_project',
  paranoid: false,
  timestamps: true,
  underscored: true
})
export class UserProject extends Model {
  @Column(DataType.STRING)
  declare position: Positions

  @ForeignKey(() => User)
  @Column
  declare userId: number
  @BelongsTo(() => User)
  declare user: CircularHelper<User>

  @ForeignKey(() => Project)
  @Column
  declare projectId: number

  @BelongsTo(() => Project)
  declare project: CircularHelper<Project>
}

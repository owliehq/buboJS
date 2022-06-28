import { CircularHelper } from '@bubojs/sequelize'
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Project, User } from '.'

export enum Rights {
  manager = 'Manager',
  worker = 'Worker',
  viewer = 'Viewer'
}

@Table({
  tableName: 'user_project',
  paranoid: false,
  timestamps: true,
  underscored: true
})
export class UserProject extends Model {
  @Column(DataType.STRING)
  declare rights: Rights

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

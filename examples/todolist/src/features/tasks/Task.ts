import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { CircularHelper } from '../../utils/TypeUtils'
import { Project } from '../projects/Project'
import { User } from '../users/User'

@Table({
  tableName: 'task',
  paranoid: true,
  timestamps: true,
  underscored: true
})
export class Task extends Model {
  @Column
  declare title: string

  @Column(DataType.TEXT)
  declare body: string

  @Column
  declare completion: number

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

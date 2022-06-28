import { AllowNull, Column, Default, Model, Table, Unique } from 'sequelize-typescript'
import { ROLES } from '../../config/constants'

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
}

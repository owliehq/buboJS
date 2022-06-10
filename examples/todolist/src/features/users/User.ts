import { Column, Model, Table, Unique } from 'sequelize-typescript'

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

  @Unique
  @Column
  declare email: string
}

import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript'

@Table({
  tableName: 'refresh_tokens',
  underscored: true,
  timestamps: true
})
export class RefreshToken extends Model<RefreshToken> {
  @PrimaryKey
  @Column
  content: string
}

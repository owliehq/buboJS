import {BelongsTo, Column, ForeignKey, Model, Table, DataType} from "sequelize-typescript";
import {User, Project} from './models'
import {CircularHelper} from "../TypeUtils";


@Table({
    tableName: 'task',
    paranoid: false,
    timestamps: true,
    underscored: true
})
export class Task extends Model{
    @Column
    declare title: string

    @Column(DataType.TEXT)
    declare body: string

    @Column
    declare completion: number

    @ForeignKey(()=> User)
    @Column
    declare userId: number

    @BelongsTo(()=> User)
    declare user: CircularHelper<User>

    @ForeignKey(()=>Project)
    @Column
    declare projectId: number
    @BelongsTo(()=>Project)
    declare project: CircularHelper<Project>

}
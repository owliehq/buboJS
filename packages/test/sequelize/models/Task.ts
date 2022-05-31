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
    title: string

    @Column(DataType.TEXT)
    body: string

    @Column
    completion: number

    @ForeignKey(()=> User)
    @Column
    userId: number

    @BelongsTo(()=> User)
    user: CircularHelper<User>

    @ForeignKey(()=>Project)
    @Column
    projectId: number
    @BelongsTo(()=>Project)
    project: CircularHelper<Project>

}
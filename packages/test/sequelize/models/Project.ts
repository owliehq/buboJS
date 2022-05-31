import {BelongsToMany, Column, HasMany, Model, Table} from "sequelize-typescript";
import {Task, UserProject} from './models'
import {CircularHelper} from "../TypeUtils";

@Table({
    tableName: 'project',
    paranoid: false,
    timestamps: true,
    underscored: true
})
export class Project extends Model{

    @Column
    name: string

    @Column
    description: string

    @HasMany(()=> UserProject)
    userProjects: CircularHelper<UserProject>[]

    @HasMany(()=>Task)
    tasks: CircularHelper<Task>[]
}
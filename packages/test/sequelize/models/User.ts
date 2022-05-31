import {Column, HasMany, Model, Table} from "sequelize-typescript";
import {Project, Task, UserProject} from './models'
import {CircularHelper} from "../TypeUtils";

@Table({
    tableName: 'user',
    underscored: true,
    paranoid: true,
    timestamps: true
})
export class User extends Model{

    @Column
    firstname: string

    @Column
    lastname: string

    @Column
    password: string

    @Column
    email: string

    @HasMany(()=> UserProject)
    projects: CircularHelper<UserProject>[]

    @HasMany(()=> Task)
    tasks: CircularHelper<Task>[]

}
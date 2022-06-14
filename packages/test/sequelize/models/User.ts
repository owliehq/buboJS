import {Column, HasMany, Model, Table} from "sequelize-typescript";
import {Project, Task, UserProject} from './models'
import {CircularHelper} from "../TypeUtils";
import {InferAttributes, InferCreationAttributes} from "sequelize";

@Table({
    tableName: 'user',
    underscored: true,
    paranoid: true,
    timestamps: true
})
export class User extends Model{

    @Column
    declare firstname: string

    @Column
    declare lastname: string

    @Column
    declare password: string

    @Column
    declare email: string

    @HasMany(()=> UserProject)
    declare projects: CircularHelper<UserProject>[]

    @HasMany(()=> Task)
    declare tasks: CircularHelper<Task>[]

}
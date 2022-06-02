import {BelongsTo, Column, ForeignKey, Model, Table, DataType} from "sequelize-typescript";
import {User, Project} from "./models";
import {CircularHelper} from "../TypeUtils";

export enum Rights {
    manager = 'Manager',
    worker = 'Worker',
    viewer = "Viewer"
}

@Table({
    tableName: 'user_project',
    paranoid: false,
    timestamps: true,
    underscored: true
})
export class UserProject extends Model{
    @Column(DataType.STRING)
    declare rights: Rights

    @ForeignKey(()=>User)
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
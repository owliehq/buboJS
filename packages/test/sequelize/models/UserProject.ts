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
    rights: Rights

    @ForeignKey(()=>User)
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
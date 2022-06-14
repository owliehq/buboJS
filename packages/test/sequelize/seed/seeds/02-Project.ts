import {Seeder} from "../seeder";
import {Project} from "../../models/models";

const bubojs : Partial<Project> = {
    name: 'Bubojs',
    description : 'Development of BuboJS Package for Owlie Team'
}

const project1 : Partial<Project> = {
    name: "project 1",
    description: 'Project 1 asked by client 1'
}

export const up: Seeder = async ({context : sequelize}) => {
    await Project.bulkCreate([bubojs, project1])
}

export const down: Seeder = async ({context: sequelize}) => {
    await Project.destroy({
        where: {},
        truncate: true,
        cascade: true,
        restartIdentity: true,
        force: true
    })
}
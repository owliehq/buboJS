import {Seeder} from "../seeder";
import {Task} from "../../models/models";

export const taskBuboApi : Partial<Task> = {
    title: "Bubo Api",
    body: "Develop Api elements of BuboJS",
    completion: 80,
    projectId : 1 // should be bubo project as it is the first
}

export const taskBuboTests: Partial<Task> = {
    title: "Bubo Tests",
    body: "Develop tests elements of BuboJS",
    completion: 15,
    projectId : 1 // should be bubo project as it is the first
}

export const taskBuboDatabase : Partial<Task> = {
    title: "Bubo Database",
    body: "Develop Database elements of BuboJS",
    completion: 38,
    projectId : 1 // should be bubo project as it is the first
}

export const taskFix1 : Partial<Task> = {
    title: "Fix 1",
    body: "Little fix for a client",
    completion: 95,
    projectId : 1 // should be bubo project as it is the first
}


export const up: Seeder = async ({context : sequelize}) => {
    await Task.bulkCreate([taskBuboApi, taskBuboTests, taskBuboDatabase, taskFix1])
}

export const down: Seeder = async ({context: sequelize}) => {
    await Task.destroy({
        where: {},
        truncate: true,
        cascade: true,
        restartIdentity: true,
        force: true
    })
}
import {Seeder} from "../seeder";
import {Rights, UserProject, User, Project} from "../../models/models";

const pierre = await User.findOne({where: {firstname: "Pierre"}})
const paul = await User.findOne({where: {firstname: "Paul"}})
const jacques = await User.findOne({where: {firstname: "Jacques"}})

const bubo = await Project.findOne({ where: {name: "Bubojs"}})

export const up: Seeder = async ({context : sequelize}) => {
    await UserProject.bulkCreate([
        {
            rights: Rights.manager, projectId: bubo.id, userId: pierre.id
        },
        {
            rights : Rights.worker, projectId: bubo.id, userId: paul.id
        },
        {
         rights: Rights.viewer, projectId: bubo.id, userId: jacques.id
        }])
}

export const down: Seeder = async ({context: sequelize}) => {
    await UserProject.destroy({
        where: {},
        truncate: true,
        cascade: true,
        restartIdentity: true,
        force: true
    })
}
import {Seeder} from "../seeder";
import {User} from "../../models/models";


export const durand : Partial<User> = {
    firstname: "Pierre",
    lastname: "Durand",
    email: "pierre@durand.xyz",
    password: "Azert123!",
}
export const dupont : Partial<User> = {
    firstname: "Paul",
    lastname: "Dupont",
    email: "paul@dupont.xyz",
    password: "Azert123!",
}
export const petit : Partial<User> = {
    firstname: "Jacques",
    lastname: "Petit",
    email: "jacques@petit.xyz",
    password: "Azert123!",
}

export const up: Seeder = async ({context : sequelize}) => {
    await User.bulkCreate([durand, dupont, petit])
}

export const down: Seeder = async ({context: sequelize}) => {
    await User.destroy({
        where: {},
        truncate: true,
        cascade: true,
        restartIdentity: true,
        force: true
    })
}
import {sequelize} from "./sequelize.database.config"


export async function initMockDb(){
    const sequelizeOptions = {alter: true, force: true}
    await sequelize.authenticate()
    const result = await sequelize.sync(sequelizeOptions)
}
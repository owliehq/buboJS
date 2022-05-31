import {sequelize} from "./sequelize.database.config"


export async function initMockDb(){
    console.log('init db')
    const sequelizeOptions = {alter: true, force: true}
    await sequelize.authenticate()
    const result = await sequelize.sync(sequelizeOptions)
    console.log(result)
}
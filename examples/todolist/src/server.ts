import { app } from '../../../packages/api/src'
import { TinyHttpAdapter } from '../../../packages/tinyhttp/src'
import { startDatabase } from './config/database'
import { UsersController } from './features/users/UsersController'

export const startServer = () =>
  new Promise(async (resolve, reject) => {
    console.log(`=========================`)
    console.log(`API server is starting...`)
    console.log(`=========================`)

    await startDatabase()

    UsersController.name
    const server = await app.initHttpModule(new TinyHttpAdapter())

    console.log(`=========================`)
    console.log(`API server is started.`)
    console.log(`=========================`)

    resolve(server)
  })

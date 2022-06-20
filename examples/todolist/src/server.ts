import { app } from '../../../packages/api/src'
import { TinyHttpAdapter } from '../../../packages/tinyhttp/src'
import { ACCESS_TOKEN_SECRET } from './config/constants'
import { startDatabase } from './config/database'
import { User } from './features/users/User'

export const startServer = () =>
  new Promise(async (resolve, reject) => {
    console.log(`=========================`)
    console.log(`API server is starting...`)
    console.log(`=========================`)

    await startDatabase()
    const adapter = new TinyHttpAdapter()
    adapter.useTokenStrategy(ACCESS_TOKEN_SECRET, async (id: string) => {
      return await User.findByPk(id)
    })

    const server = await app.initHttpModule(adapter)

    console.log(`=========================`)
    console.log(`API server is started.`)
    console.log(`=========================`)

    resolve(server)
  })

import { app } from '@bubojs/api'
import { TinyHttpAdapter } from '../../src/index'
import { CarController } from './controller'

export const startServer = async (port: number) => {
  CarController.name
  return await app.initHttpModule(new TinyHttpAdapter(), { port: 3000 })
}

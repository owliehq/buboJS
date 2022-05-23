import { TinyHttpAdapter } from '@bubojs/tinyhttp'
import { CarController } from './controller'
import { app } from '@bubojs/api'

export const startServer = async (port: number) => {
  CarController.name
  return await app.initHttpModule(new TinyHttpAdapter())
}

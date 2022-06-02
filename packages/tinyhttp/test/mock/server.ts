import { UsersService } from './services/UsersService'
import { TinyHttpAdapter } from '@bubojs/tinyhttp'
import { CarController } from './controller'
import { app } from '@bubojs/api'
import { CarsService } from './services/CarsService'
import { WheelsService } from './services'

export const startServer = async (port: number) => {
  CarController.name
  return await app.initHttpModule(new TinyHttpAdapter())
}

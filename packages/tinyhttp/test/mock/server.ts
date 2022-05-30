import { UsersService } from './services/UsersService'
import { TinyHttpAdapter } from '@bubojs/tinyhttp'
import { CarController } from './controller'
import { app } from '@bubojs/api'
import { CarsService } from './services/CarsService'

export const startServer = async (port: number) => {
  UsersService.name
  CarsService.name
  CarController.name
  return await app.initHttpModule(new TinyHttpAdapter())
}

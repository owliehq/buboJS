import { app } from '@bubojs/api'
import { TinyHttpAdapter } from '@bubojs/tinyhttp'
import { CarController } from './controller'

export const startServer = async (port: number) => {
  CarController.name
  await app.initHttpModule(new TinyHttpAdapter())

  return app.listen(3000)
}

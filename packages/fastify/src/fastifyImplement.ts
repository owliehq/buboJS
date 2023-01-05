import fastify, { FastifyInstance } from 'fastify'
import { AdapterHttpModule } from './adapterHttpModule.js'

export class FastifyImplement implements AdapterHttpModule {
  public app: FastifyInstance
  constructor() {
    this.app = fastify({ logger: true })
  }
  public get getApp() {
    return this.app
  }
  public async startServer() {
    await this.app.listen(3000)
  }
  public stopServer() {
    this.app.close()
  }

  public get(path: string, routeFunction: any): object {
    return this.app.get(path, routeFunction)
  }
}

import { HttpFrameworkEnum, ServerConfig } from './interfaces';
import { AdapterHttpModule, FastifyImplement } from '@bubojs/fastify';
import { FastifyRequest, FastifyReply } from 'fastify';
import { TinyHttpImplement } from '@bubojs/tinyhttp';

export class App {
  httpInstance: AdapterHttpModule;

  constructor() {}

  public async startServer(config: ServerConfig) {
    if (config.httpFramework === HttpFrameworkEnum.TINY_HTTP) {
      this.httpInstance = new TinyHttpImplement();
      this.httpInstance.app.get(
        '/',
        (req: any, res: any) => void res.send('salut')
      );
      await this.httpInstance.startServer();

      return this.httpInstance;
    }
    if (config.httpFramework === HttpFrameworkEnum.FASTIFY) {
      this.httpInstance = new FastifyImplement();
      this.httpInstance.app.get(
        '/',
        (req: FastifyRequest, res: FastifyReply) => void res.send('salut')
      ); //test pour le moment
      await this.httpInstance.startServer();

      return this.httpInstance;
    }
  }

  public async stopServer() {
    await this.httpInstance.stopServer();
  }
}

import { ServerConfig } from './interfaces';
import { AdapterHttpModule } from './adapters';
import { TinyHttpAdapter } from '@bubojs/tinyhttp';
import { MetadataManager } from './MetadataManager';

console.log('app');
export class App {
  httpInstance: AdapterHttpModule;

  constructor() {}

  public async startServer(config: ServerConfig) {
    // if (config.httpFramework === HttpFrameworkEnum.TINY_HTTP) {
    //   this.httpInstance = new TinyHttpAdapter();
    //   this.httpInstance.app.get(
    //     '/',
    //     (req: any, res: any) => void res.send('salut')
    //   );
    //   await this.httpInstance.startServer();
    //   return this.httpInstance;
    // }
    // if (config.httpFramework === HttpFrameworkEnum.FASTIFY) {
    //   this.httpInstance = new FastifyImplement();
    //   this.httpInstance.app.get(
    //     '/',
    //     (req: FastifyRequest, res: FastifyReply) => void res.send('salut')
    //   ); //test pour le moment
    //   await this.httpInstance.startServer();
    //   return this.httpInstance;
    // }

    console.log('startServer');
    //this.httpInstance = new TinyHttpAdapter();
    console.log(MetadataManager.meta);

    MetadataManager.meta.controllers.map(
      (controllerMetadata, controllerKey) => {
        controllerMetadata.routes.map((routeMetadata, routeKey) => {
          this.httpInstance.get(
            `${controllerMetadata.path}/${routeMetadata.path}`,
            routeMetadata.handler
          );
        });
      }
    );

    return this.httpInstance.startServer();
  }

  public async stopServer() {
    await this.httpInstance.stopServer();
  }
}

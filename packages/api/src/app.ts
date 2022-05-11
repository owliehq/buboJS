import { ServerConfig } from './interfaces';
import { App as AppTiny } from '@tinyhttp/app';
import { Server } from 'http';
export class App {
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
    // console.log('startServer');
    // this.httpInstance = new TinyHttpAdapter();
    // console.log(MetadataManager.meta);
    // MetadataManager.meta.controllers.map(
    //   (controllerMetadata, controllerKey) => {
    //     controllerMetadata.routes.map((routeMetadata, routeKey) => {
    //       this.httpInstance.get(
    //         `${controllerMetadata.path}/${routeMetadata.path}`,
    //         routeMetadata.handler
    //       );
    //     });
    //   }
    // );
    // return this.httpInstance.startServer();
  }

  private controllers = [];

  public registerController(controller: any) {
    this.controllers.push(controller);
  }

  public initHttpModule(): Server {
    const app = new AppTiny();

    this.controllers.map((controller) => {
      app.use(controller.path, controller.router);
    });

    return app.listen(3000);
  }
}

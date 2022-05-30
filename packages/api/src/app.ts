import { Server } from 'http'
import { AdapterHttpModule } from './adapters'
import { HttpResolver } from './HttpResolver'
import { ServerConfig } from './interfaces'
import { MetadataManager } from './MetadataManager'
import { ServiceResolver } from './ServiceResolver'
export class App {
  public server: AdapterHttpModule<any>

  constructor() {}

  public async startServer(config: ServerConfig) {
    console.log('APP')
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

  public initHttpModule(adapter: AdapterHttpModule<any>): Server {
    this.server = adapter

    const controllerResolver = new HttpResolver(adapter)
    controllerResolver.controllerRevolve(MetadataManager.meta)

    const serviceResolver = new ServiceResolver(adapter)
    serviceResolver.serviceResolve(MetadataManager.meta)

    // TODO one last boucle on service to instanciate service

    return this.server.listen(3000)
  }
}

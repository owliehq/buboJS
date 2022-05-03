import { App } from '@tinyhttp/app';
import { AdapterHttpModule } from '@bubojs/fastify';

export class TinyHttpImplement implements AdapterHttpModule {
  public app: App;
  constructor() {
    const app = new App();
  }
  public get getApp() {
    return this.app;
  }
  public startServer() {
    this.app.listen(3000);
  }
  public stopServer() {}

  public get(path: string, routeFunction: Function) {
    return {};
  }
}

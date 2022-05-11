import { App } from '@tinyhttp/app';
import { AdapterHttpModule } from '@bubojs/api';

export class TinyHttpAdapter implements AdapterHttpModule {
  public app: App;
  constructor() {
    this.app = new App();
  }

  public init() {
    return;
  }

  public startServer() {
    const server = this.app.listen(3000);
    console.log('listened to 3000');
    return server;
  }
  public stopServer() {}

  public get(path: string, handler: any) {
    this.app.get(path, handler);
  }
}

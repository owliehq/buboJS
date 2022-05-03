export interface AdapterHttpModule {
  app: any;

  startServer(): void;
  stopServer(): void;

  get(path: string, routeFunction: Function): object;
}

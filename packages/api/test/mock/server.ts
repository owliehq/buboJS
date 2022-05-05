import { app, HttpFrameworkEnum } from '../../src';

export const startServer = async (port: number) => {
  await app.startServer({ httpFramework: HttpFrameworkEnum.TINY_HTTP });
  return app;
};

import { app, HttpFrameworkEnum } from '../../src';
import { CarController } from './controller';

export const startServer = async (port: number) => {
  CarController.name;
  return await app.startServer({ httpFramework: HttpFrameworkEnum.TINY_HTTP });
};

export const stopServer = async () => {
  await app.stopServer();
};

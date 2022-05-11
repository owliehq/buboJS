import { app, HttpFrameworkEnum } from '../../src';
import { CarController } from './controller';

export const startServer = async (port: number) => {
  CarController.name;
  return await app.initHttpModule();
};

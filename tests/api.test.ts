import { App } from '../packages/api/src/app';
import { HttpFrameworkEnum } from '../packages/api/src/ServerConfig';

let app;

beforeAll(() => {
  app = new App();
});

describe('APIModule', () => {
  it('should be true', async () => {
    await app.startServer({ httpFramework: HttpFrameworkEnum.FASTIFY });
    expect(true).toBeTruthy();
  });
});

afterAll(async () => {
  await app.stopServer();
});

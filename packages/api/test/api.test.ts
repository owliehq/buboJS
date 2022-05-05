import { App, HttpFrameworkEnum } from '@bubojs/api';

let app;

beforeAll(() => {
  console.log('before');
  app = new App();
});

describe('APIModule', () => {
  it('should be true', async () => {
    console.log('test');
    await app.startServer({ httpFramework: HttpFrameworkEnum.TINY_HTTP });
    console.log('started');
    expect(true).toBeTruthy();
    console.log('true');
  });
});

afterAll(async () => {
  await app.stopServer();
});

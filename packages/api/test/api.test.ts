import request from 'supertest';
import { startServer, stopServer } from './mock/server';

let app;

beforeAll(async () => {
  app = await startServer(3000);
});

describe('APIModule', () => {
  it('should be true', async () => {
    expect(true).toBeTruthy();
  });

  it('should return cars', async () => {
    await request(app)
      .get('/recent')
      .expect(200)
      .then((response) => {
        console.log(response.body);
        expect(response.body).toBeTruthy();
      });
  });
});

afterAll(async () => {
  await stopServer();
});

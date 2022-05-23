import request from 'supertest'
import { startServer } from '../../tinyhttp/test/mock/server'

let app

beforeAll(async () => {
  app = await startServer(3000)
})

describe('middlewares controller', () => {
  it('should return one before middleware', async () => {
    await request(app)
      .get('/middlewares/beforeMiddleware')
      .expect(200)
      .then(response => {
        expect(response.text).toBeTruthy()
        expect(response.text).toBe('middleware added value')
      })
  })

  it('should return before middlewares', async () => {
    await request(app)
      .get('/middlewares/beforeMiddlewares')
      .expect(200)
      .then(response => {
        expect(response.text).toBeTruthy()
        expect(response.text).toBe('middleware added value twice')
      })
  })

  it('should return middlewares', async () => {
    await request(app)
      .get('/middlewares/middlewares')
      .expect(200)
      .then(response => {
        expect(response.text).toBeTruthy()
        expect(response.text).toBe('middleware added value content after')
      })
  })

  // it('should be array instead of simple object as a result', async () => {
  //   await request(app)
  //     .get('/middlewares/1')
  //     .expect(200)
  //     .then(response => {
  //       console.log(response)
  //       expect(response).toBeTruthy()
  //     })
  // })
})

afterAll(async () => {})

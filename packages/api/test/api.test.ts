import request from 'supertest'
import { startServer } from './mock/server'

let app

beforeAll(async () => {
  app = await startServer(3000)
})

describe('APIModule', () => {
  it('should return cars', async () => {
    await request(app)
      .get('/cars/recent')
      .expect(200)
      .then(response => {
        expect(response.body).toBeTruthy()
        expect(response.body.length).toBe(3)
      })
  })

  it('should return text', async () => {
    await request(app)
      .get('/cars/text')
      .expect(200)
      .then(response => {
        expect(response.text).toBe('plop')
      })
  })
})

afterAll(async () => {})

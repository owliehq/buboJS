import request from 'supertest'
import { startServer } from './mock/server'

let app

beforeAll(async () => {
  app = await startServer(3000)
})

describe('APIModule', () => {
  it('should be true', async () => {
    expect(true).toBeTruthy()
  })

  it('should return cars', async () => {
    await request(app)
      .get('/cars/recent')
      .expect(200)
      .then(response => {
        expect(response.body).toBeTruthy()
        expect(response.body.length).toBe(3)
      })
  })

  it('should return one car', async () => {
    await request(app)
      .get('/cars/2')
      .expect(200)
      .then(response => {
        expect(response.text).toBeTruthy()
        expect(response.text).toEqual('car2')
      })
  })

  it('should not return one car', async () => {
    await request(app)
      .get('/cars/5')
      .expect(200)
      .then(response => {
        expect(response.body).toBeTruthy()
        expect(response.body).toEqual({ error: 123, message: 'Invalid Id' })
      })
  })

  it('should return one wheel', async () => {
    await request(app)
      .get('/cars/2/wheels/4')
      .expect(200)
      .then(response => {
        expect(response.text).toBeTruthy()
        expect(response.text).toEqual('Wheel 4 of Car 2')
      })
  })
})

afterAll(async () => {})

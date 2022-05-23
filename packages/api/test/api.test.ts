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

  it('should return header', async () => {
    await request(app)
      .get('/cars/header')
      .set('Accept', 'text/html')
      .expect(200)
      .then(response => {
        expect(response.text).toBeTruthy()
        expect(response.text).toBe('text/html')
      })
  })

  it('should return query', async () => {
    await request(app)
      .get('/cars/query?code=abc')
      .set('Accept', 'text/html')
      .expect(200)
      .then(response => {
        expect(response.text).toBeTruthy()
        expect(response.text).toBe('abc')
      })
  })

  it('should return one before middleware', async () => {
    await request(app)
      .get('/cars/beforeMiddleware')
      .expect(200)
      .then(response => {
        expect(response.text).toBeTruthy()
        expect(response.text).toBe('middleware added value')
      })
  })

  it('should return before middlewares', async () => {
    await request(app)
      .get('/cars/beforeMiddlewares')
      .expect(200)
      .then(response => {
        expect(response.text).toBeTruthy()
        expect(response.text).toBe('middleware added value twice')
      })
  })

  it('should return middlewares', async () => {
    await request(app)
      .get('/cars/middlewares')
      .expect(200)
      .then(response => {
        expect(response.text).toBeTruthy()
        expect(response.text).toBe('middleware added value content after')
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

  it('should return created car', async () => {
    await request(app)
      .post('/cars')
      .send({ name: 'Clio', brand: 'Renault' })
      .set('Accept', 'application/json')
      .expect(200)
      .then(response => {
        expect(response.body).toBeTruthy()
        expect(response.body).toEqual({ brand: 'Renault', id: 100, name: 'Clio' })
      })
  })

  it('should return created wheel', async () => {
    await request(app)
      .post('/cars/2/wheels')
      .set('Content-Type', 'text/html')
      .send('17 pouces')
      .expect(200)
      .then(response => {
        expect(response.text).toBeTruthy()
        expect(response.text).toEqual('good year 17 pouces')
      })
  })
})

afterAll(async () => {})

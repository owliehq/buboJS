import request from 'supertest'
import { startServer } from '../src/server'
import { UserRepository } from '../src/features/users/UserRepository'
import { User } from '../src/features/users/User'

let app
let userRepository: UserRepository
let user: User

beforeAll(async () => {
  app = await startServer()
  userRepository = new UserRepository()
  user = await userRepository.create({
    firstName: 'toto',
    lastName: 'titi',
    password: 'mdpsecret',
    email: 'totodu99@hotmail.fr'
  })
})

describe('userModule', () => {
  it('should get all users', async () => {
    await request(app)
      .get('/users')
      .expect(200)
      .then(response => {
        expect(response.body).toBeTruthy()
        expect(response.body.length).toBeGreaterThan(0)
      })
  })

  it('should create user', async () => {
    await request(app)
      .post('/users')
      .send({
        firstName: 'taratata',
        lastName: 'totoro',
        password: 'mdpsecretencore',
        email: 'totorodu99@hotmail.fr'
      })
      .set('Accept', 'application/json')
      .expect(200)
      .then(response => {
        expect(response.body).toBeTruthy()
        expect(response.body).toMatchObject({
          firstName: 'taratata',
          lastName: 'totoro',
          password: 'mdpsecretencore',
          email: 'totorodu99@hotmail.fr'
        })
      })
  })

  it('should get one user', async () => {
    await request(app)
      .get(`/users/${user.id}`)
      .expect(200)
      .then(response => {
        expect(response.body).toBeTruthy()
        expect(response.body).toMatchObject({
          firstName: 'toto',
          lastName: 'titi',
          password: 'mdpsecret',
          email: 'totodu99@hotmail.fr'
        })
      })
  })

  it('should update one user', async () => {
    await request(app)
      .put(`/users/${user.id}`)
      .send({
        firstName: 'totot',
        lastName: 'titit',
        password: 'mdpsecret2',
        email: 'totodu99@gmail.com'
      })
      .set('Accept', 'application/json')
      .expect(200)
      .then(response => {
        expect(response.body).toBeTruthy()
        expect(response.body).toMatchObject({
          firstName: 'totot',
          lastName: 'titit',
          password: 'mdpsecret2',
          email: 'totodu99@gmail.com'
        })
      })
  })

  it('should delete one user', async () => {
    const getUserFunction = async () => {
      const userDeleted = await userRepository.findById(user.id)
    }
    await request(app)
      .delete(`/users/${user.id}`)
      .expect(200)
      .then(async response => {
        expect(await getUserFunction).rejects.toThrow('User not found')
      })
  })
})

afterAll(async () => {})

export default app

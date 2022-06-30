import request from 'supertest'
import { startServer } from '../src/server'
import { UsersRepository } from '../src/features/users/UsersRepository'
import { User } from '../src/features/users/User'
import { ROLES } from '../src/config/constants'

let app
let usersRepository: UsersRepository
let user: User

beforeAll(async () => {
  app = await startServer()
  usersRepository = new UsersRepository()
  user = await usersRepository.create({
    firstName: 'toto',
    lastName: 'titi',
    password: 'mdpsecret',
    email: 'totodu99@hotmail.fr',
    role: ROLES.USER
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
      const userDeleted = await usersRepository.findById(user.id)
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

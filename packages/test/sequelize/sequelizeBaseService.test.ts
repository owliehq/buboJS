import { initMockDb, sequelize } from './mock'
import { ModelData, SequelizeBaseRepository, SequelizePopulate } from '@bubojs/sequelize'
import { Project, Task, User, UserProject } from './models/models'
import { randEmail, randFirstName, randLastName, randPassword } from '@ngneat/falso'
import { SequelizeConditionsParser } from '@bubojs/sequelize/src/SequelizeConditions'
import { Op } from 'sequelize/types'

// params
const userCount = 3

// test repository
class UserRepository extends SequelizeBaseRepository<User> {
  constructor() {
    super(User)
  }
}
const repository = new UserRepository()

// user data to be used for tests
let userId: number | null = null
let testUserData: ModelData<User> = {
  firstname: randFirstName(),
  lastname: randLastName(),
  email: randEmail(),
  password: randPassword()
}

beforeAll(async () => {
  await initMockDb()
  // populate base with some users
  for (let i = 0; i < userCount; i++) {
    let userData: ModelData<User> = {
      firstname: randFirstName(),
      lastname: randLastName(),
      email: randEmail(),
      password: randPassword()
    }
    await User.create(userData)
  }
})

describe('Sequelize Base Service', () => {
  test('should create a new user', async () => {
    const newUser = await repository.create(testUserData)
    userId = newUser.id
    expect(newUser.firstname).toBe(testUserData.firstname)
    expect(newUser.lastname).toBe(testUserData.lastname)
    expect(newUser.email).toBe(testUserData.email)
    expect(newUser.password).toBe(testUserData.password)
  })

  test('should get a User', async () => {
    const user = await repository.findById(userId.toString())
    expect(user).toBeDefined()
    expect(user).toBeInstanceOf(User)
    expect(user.id).toBe(userId)
  })

  test('should get all users', async () => {
    //[userCount] users was created and one in tests
    const users = await repository.findAll()
    expect(users.length).toBe(userCount + 1)
    expect(users[0]).toBeInstanceOf(User)
  })

  test('should modify one user', async () => {
    const newName = 'TestName'
    const updatedUser = await repository.update(userId.toString(), { firstname: newName })
    expect(updatedUser.firstname).toBe(newName)
  })

  test('should delete one user', async () => {
    await repository.delete(userId.toString())
    const newCount = (await repository.findAll()).length
  })
})

describe('Sequelize Populate Functions', () => {
  const populator = new SequelizePopulate(Project, ['tasks', 'userProjects.user'])
  test('simple include', async () => {
    const wTasks = populator.buildIncludeOptions('tasks')
    expect(wTasks).toStrictEqual([{ model: Task, as: 'tasks' }])
  })

  test('Nested include', async () => {
    const wUserProject = populator.buildIncludeOptions('userProjects.user')
    expect(wUserProject).toStrictEqual([
      { model: UserProject, as: 'userProjects', include: [{ model: User, as: 'user' }] }
    ])
  })
  test('Forbidden include', async () => {
    const wU = populator.buildIncludeOptions('users')
    expect(wU).toStrictEqual([])
  })

  test('Include with simple, nested + forbidden, forbidden', () => {
    const wAll = populator.buildIncludeOptions('tasks userProjects.user.tasks user')
    expect(wAll).toStrictEqual([
      { model: Task, as: 'tasks' },
      { model: UserProject, as: 'userProjects', include: [{ model: User, as: 'user' }] }
    ])
  })
})

describe('Sequelize Query Functions', () => {
  const parser = new SequelizeConditionsParser()
  test('Query with a simple where', async () => {
    expect(parser.toOptions({ id: 3 })).toBe({ where: { id: 3 } })
  })

  test('Query with a range for id', async () => {
    expect(parser.toOptions({ id: { $in: [1, 2, 3] } })).toBe({ where: { id: { [Op.in]: [1, 2, 3] } } })
  })

  test('Query with two parameters', async () => {
    expect(parser.toOptions({ $and: [{ id: 3 }, { name: 'Roger' }] })).toBe({
      where: { [Op.and]: [{ id: 3 }, { name: 'Roger' }] }
    })
  })
})

afterAll(async () => {
  await sequelize.close()
})

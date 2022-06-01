import {initMockDb} from "./mock";
import {ModelData, SequelizeBaseRepository} from "@bubojs/sequelize";
import {User} from "./models/models";
import {randEmail, randFirstName, randLastName, randPassword} from '@ngneat/falso'

// params
const userCount = 3

// test repository
class UserRepository extends SequelizeBaseRepository<User> {
    constructor() {
        super(User);
    }
}
const repository = new UserRepository()


// user data to be used for tests
let userId : number | null = null
let testUserData : ModelData<User> = {
    firstname: randFirstName(),
    lastname: randLastName(),
    email: randEmail(),
    password: randPassword(),
}


beforeAll(async () => {
    await initMockDb()
    // populate base with some users
    for(let i = 0; i < userCount; i++){
        let userData : ModelData<User> = {
            firstname: randFirstName(),
            lastname: randLastName(),
            email: randEmail(),
            password: randPassword(),
        }
        await User.create(userData)
    }
})

describe('Sequelize Base Service', () => {
    test('should create a new user', async()=>{
        const newUser = await repository.create(testUserData)
        userId = newUser.id
        expect(newUser.firstname).toBe(testUserData.firstname)
        expect(newUser.lastname).toBe(testUserData.lastname)
        expect(newUser.email).toBe(testUserData.email)
        expect(newUser.password).toBe(testUserData.password)
    })

    test('should get a User', async()=>{
        const user = await repository.getOne(userId.toString())
        expect(user).toBeDefined()
        expect(user).toBeInstanceOf(User)
        expect(user.id).toBe(userId)
    })

    test( 'should get all users', async()=>{

        //[userCount] users was created and one in tests
        const users = await repository.getMany()
        expect(users.length).toBe(userCount+1)
        expect(users[0]).toBeInstanceOf(User)
    })

    test('should modify one user', async()=> {
        const newName = 'TestName'
        const updatedUser = await repository.update(userId.toString(), {firstname: newName})
        expect(updatedUser.firstname).toBe(newName)
    })

    test('should delete one user', async ()=> {
        await repository.delete(userId.toString())
        const newCount = (await repository.getMany()).length
    })
})

//afterAll(async () => {})
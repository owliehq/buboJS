import { Inject, Service, ObjectType } from '@bubojs/api'
import { UsersService } from './UsersService'

@Service()
export class CarsService {
  @Inject('UsersService') public usersService: ObjectType<UsersService>

  getAllCars() {
    return ['car1', 'car2', 'car3', 'car4', 'car5']
  }

  getCarById(id: string) {
    switch (id) {
      case '1':
        return { name: 'car1' }
      case '2':
        return { name: 'car2' }
      case '3':
        return { name: 'car3' }
      case '4':
        return { name: 'car4' }
      case '5':
        return { name: 'car5' }
    }
  }

  getAllCarsByUser(userId: string) {
    const user = this.usersService.getUserById(userId)
    if (user) {
      const allCars = this.getAllCars()
      allCars.pop()
      return allCars
    }
    return 'no car found'
  }
}

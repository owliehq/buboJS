console.log('INIT UsersService')

import { Inject, Service } from '@bubojs/api'
import { CarsService } from './CarsService'

@Service()
export class UsersService {
  @Inject public carsService: CarsService

  generatePassword() {
    return '123Azert456#@%789'
  }

  getAllUsers() {
    return ['user1', 'user2', 'user3']
  }

  getUserById(id: string) {
    switch (id) {
      case '1':
        return { name: 'user1' }
      case '2':
        return { name: 'user2' }
      case '3':
        return { name: 'user3' }
    }
  }

  getCarOwner(carId: string) {
    const car = this.carsService.getCarById(carId)
    if (car) {
      const users = this.getAllUsers()
      users.pop()
      return users
    }
    return 'no owner found'
  }
}

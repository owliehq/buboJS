import { Service } from '@bubojs/api'

@Service()
export class WheelsService {
  getAllWheels() {
    return ['wheel1', 'wheel2', 'wheel3']
  }
}

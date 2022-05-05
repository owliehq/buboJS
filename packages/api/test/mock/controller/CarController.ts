import { Controller, DefaultActions, Get } from '../../../src';

@Controller('cars')
class CarController {
  [DefaultActions.GET_ONE]() {}

  [DefaultActions.GET_MANY]() {}

  [DefaultActions.CREATE_ONE]() {}

  [DefaultActions.DELETE_ONE]() {}

  @Get('/recent')
  findAllRecentCars() {
    return ['car1', 'car2', 'car3'];
  }
}

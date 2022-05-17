import { Controller, DefaultActions, Get, MetadataManager, Post } from '../../../src'
import { Body, Params } from '../../../src/decorators/http/parameters.decorator'
import { BodyFormat } from '../../../src/interfaces/DecoratorOptions'

@Controller('cars')
export class CarController {
  [DefaultActions.GET_ONE]() {}

  [DefaultActions.GET_MANY]() {}

  [DefaultActions.CREATE_ONE]() {}

  [DefaultActions.DELETE_ONE]() {}

  @Get('/recent')
  findAllRecentCars() {
    return ['car1', 'car2', 'car3']
  }

  @Get('/text')
  sendText() {
    return 'plop'
  }
  
  @Get('/:id')
  findOneCar(@Params('id') id: string) {
    switch (id) {
      case '1':
        return 'car1'
      case '2':
        return 'car2'
      case '3':
        return 'car3'
      default:
        return { error: 123, message: 'Invalid Id' }
    }
  }

  @Get('/:id/wheels/:wheelId')
  findWheel(@Params('wheelId') wheelId: string, @Params('id') id: string) {
    return `Wheel ${wheelId} of Car ${id}`
  }

  @Post('/', { bodyFormat: BodyFormat.JSON })
  createCarJson(@Body body: any) {
    console.log('Body', body)
    const name = { body }
    return { ...body, id: 100 }
  }

  //TODO test with response.text
}

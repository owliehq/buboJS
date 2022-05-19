import { BodyFormat, Controller, DefaultActions, Get, MetadataManager, Post } from '../../../src'
import { Body, Header, Params, Query } from '../../../src/decorators/http/parameters.decorator'
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

  @Get('/header')
  sendHeader(@Header('Accept') acceptHeader: string) {
    return acceptHeader
  }

  @Get('/query')
  sendQuery(@Query('code') code: string) {
    return code
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

  @Post('/:id/wheels', { bodyFormat: BodyFormat.RAW })
  createWheel(@Body body: any) {
    return 'good year ' + body
  }

  @Post('/', { bodyFormat: BodyFormat.JSON })
  createCarJson(@Body body: any) {
    return { ...body, id: 100 }
  }

  //TODO test with response.text
}

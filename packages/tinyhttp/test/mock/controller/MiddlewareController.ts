import { Controller, DefaultActions, Get, AfterMiddleware, BeforeMiddleware, Body } from '@bubojs/api'

@Controller('middlewares')
export class MiddlewareController {
  //   @BeforeMiddleware((req: any, res: any, next: Function): void => {
  //     if (!req.body) req.body = {}
  //     req.body.test = 'middleware added value'
  //     next()
  //   })
  //   @AfterMiddleware((req: any, res: any, next: Function): void => {
  //     req.result = [req.result]
  //     next()
  //   })
  [DefaultActions.GET_ONE]() {}

  [DefaultActions.GET_MANY]() {}

  [DefaultActions.CREATE_ONE]() {}

  [DefaultActions.DELETE_ONE]() {}

  @BeforeMiddleware((req: any, res: any, next: Function): void => {
    if (!req.body) req.body = {}
    req.body.test = 'middleware added value'
    next()
  })
  @Get('/beforeMiddleware')
  sendBeforeMiddleware(@Body body: any) {
    const { test } = body
    return test
  }

  @BeforeMiddleware((req: any, res: any, next: Function): void => {
    if (!req.body) req.body = {}
    req.body.test = 'middleware added value'
    next()
  })
  @BeforeMiddleware((req: any, res: any, next: Function): void => {
    if (!req.body) req.body = {}
    req.body.test = req.body.test + ' twice'
    next()
  })
  @Get('/beforeMiddlewares')
  sendBeforeMiddlewares(@Body body: any) {
    const { test } = body
    return test
  }

  @BeforeMiddleware((req: any, res: any, next: Function): void => {
    if (!req.body) req.body = {}
    req.body.test = 'middleware added value'
    next()
  })
  @AfterMiddleware((req: any, res: any, next: Function): void => {
    req.result = req.result + ' after'
    next()
  })
  @Get('/middlewares')
  sendMiddlewares(@Body body: any) {
    const { test } = body
    return test + ' content'
  }
}

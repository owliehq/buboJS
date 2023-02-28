<p align="center">
  <a href="https://github.com/owliehq/buboJS/tree/develop">
    <img src="https://owlie.xyz/bubo/bubo-js.png">
  </a>
</p>

## Api ##

[![api version](https://img.shields.io/npm/v/@bubojs/api?label=api)](https://www.npmjs.com/package/@bubojs/api) 

[Back to Main Menu](../../README.md#les-controllers)

The API package is the heart of bubo, it creates the routes, registers the middleware and orchestrates everything, it provides decorators to easily create routes via classes and functions.

### Creating a controller ###

To make a controller the file that contains the class must end with "Controller.ts", a search is made in the project file names to find the different controllers

Then the Controller class must be decorated with a

```ts
@Controller() 
```

This will result in the creation of a sub route, the name of this sub route will be the name of the controller class without the controller at the end, written in snake case and all pluralized
the decorator takes an optional options object as parameter which contains two fields:

```ts
export interface ControllerParams {
  repository?: BuboRepository<unknown>
  overrideRouteName?: string
}
```

__repository__ allows to define a repository which will allow to generate routes automatically
__overrideRouteName__ allows to define another route name than the one generated automatically

### Adding an automatic route ###

To build an automatic route you need to provide the controller with a repository (currently only [sequelize](packages/sequelize/README.md) is available)

The repository

```ts

import { SequelizeBaseRepository } from '@bubojs/sequelize'
import { SqlzModel } from './SqlzModel'

class MyRepository extends SequelizeBaseRepository<SqlzModel> {
  constructor() {
    super(SqlzModel)
  }
}
export const myRepositoryInstance = new MyRepository()
```

The controller

```ts
import { Controller, DefaultActions, BeforeMiddleware, Post, Get, BodyFormat, Body } from '@bubojs/api'
import { myRepositoryInstance } from './MyRepository'

@Controller({ repository: myRepositoryInstance })
class DropController {}
```

For security reasons no automatic route is built by default, you have to activate the ones you need, for that you have to define one by one the routes by creating a field in the controller with this bias:

```ts
import { Controller, DefaultActions, BeforeMiddleware, Post, Get, BodyFormat, Body } from '@bubojs/api'
import { myRepositoryInstance } from './MyRepository'

@Controller({ repository: myRepositoryInstance })
class BaseController 
{
    
    [DefaultActions.CREATE_ONE](){}
    [DefaultActions.UPDATE_ONE](){}
    [DefaultActions.GET_ONE]() {}
    [DefaultActions.GET_MANY]() {}
    [DefaultActions.DELETE_ONE]() {}
}
```

These routes create a direct request to the database, you can add options to this request via our dedicated middleware (see below), or add your own options by passing them in req.$sequelize ( ⚠️ beware of the interaction between several options middlewares)
So we have the following routes:

- __POST__ /base/
- __PUT__ /base/:id
- __GET__ /base/:id
- __GET__ /base/
- __DELETE__ /base/:id

### Adding a custom route ###

A custom route is added via a decorator:

```ts
import { Controller, DefaultActions, BeforeMiddleware, Post, Get, BodyFormat, Body } from '@bubojs/api'

@Controller()
class TestController 
{
  @Get('/hello_world')
  greetings(){
    return 'hello world'
  }
}
```

we have just created a route that returns __hello_world__ on __address:port/test/hello_world__

#### Passing parameters on custom routes ####

To pass parameters to your functions on custom routes we have developed decorators to extract data from __req.query__, __req.params__, __req.body__ using respectively __@Query('fieldName')__, __@Params('paramName')__, __@Body('fieldName')__
example:

```ts
import { Controller, Post, Get, Body, Query } from '@bubojs/api'
@Controller()
class MyController
{
  @Get('/hello_world')
  greetings(@Query('username') username: string){
    return `hello ${username}`
  }
}
```

will return __hello bubo__ on the Get __{{api}}/drop/hello_world?username=bubo__

#### Modify the parser ####

By default the route parser is set to __AUTO__ it will accept all formats it is able to parse (RAW, TEXT, JSON, URL_ENCODED)
but you can also force a format, the options are:

- RAW
- TEXT
- JSON
- AUTO (parse with the best identified method)
- SKIP (does not parse the body in case you want to put your own parser in the middleware)
- URL_ENCODED

example:

```ts
import { Controller, Post, Body, BodyFormat } from '@bubojs/api'
@Controller()
class MyController
{
  @Post('/test', { bodyFormat: BodyFormat.JSON })
  test(@Body('username') username: string){
    return `hello ${username}`
  }
}
```

In this case the route will refuse anything that is not in JSON format

#### Raw Handler ####

When you build a custom route the buboJs api will wrap your function to retrieve its result and store it in req.result, this will allow you to call other middleware afterwards to perform formatting operations for example.
You can however define yourself the handler and manage directly the call of the following middleware (or not), for that you will provide to the decorator of the custom route not the function you want to execute but a constructor of the handler you want to call, it is also necessary to activate the option __{rawHandler : true}__ in the decorator of the route
example:

```ts
import { Controller, Post, Body, BodyFormat } from '@bubojs/api'
@Controller()
class MyController
{
  @Get('/hello_world', { rawHandler: true, bodyFormat: BodyFormat.AUTO })
  builder() {
    return (req: any, res: any, next: Function) => {
      res.status(200).json(`hello ${req.query.username}`)
    }
  }
}
```

[Back to Main Menu](../../README.md#les-controllers)

## Editor

<p>
  <a href="https://www.owlie.xyz">
    <img style="border-radius:50%" width="100" height="100" src="https://www.owlie.xyz/bubo/owlielogo.png">
  </a>
</p>
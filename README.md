<p align="center">
  <a href="https://www.owlie.xyz">
    <img src="https://owlie.xyz/bubo/bubo-js.png">
  </a>
</p>

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/license/mit/) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![Version](https://img.shields.io/npm/v/@bubojs/api/latest.svg)](https://www.npmjs.com/package/@bubojs/api) [![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

BuboJs is a library to build quickly and efficiently a Rest API, it is based on NodeJS, written entirely in Typescript and using ESModules.
Main Features:

- Automatic route building with a direct link to the database (PostGres)
- Integrated role management tools
- File upload and download tools (firebase)
- Route validation tools

## Contribution

### Install

Install modules using lerna bootstrap to centralize all modules in root node_modules.

```bash
lerna bootstrap
```

### Build

It's necessary to build ts files into js files to execute them
This command remove previous build dir and build them with tsc compiler

```bash
yarn build
```

### Run tests

Jest run all \*.test.ts files in packages/\* dir
⚠️You should build packages to execute tests⚠️

```bash
yarn test
```

## Usage

### Starting server

To start the server you must instantiate an HttpAdapter (currently only tinyhttp is available)
Then to actually start the server you have to pass this instance and the options you need to the 
__app.initHttpModule()__

example:

```ts
import { TinyHttpAdapter } from '@bubojs/tinyhttp'
import { app, AppOptions } from '@bubojs/api'

export const startServer = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const adapter = new TinyHttpAdapter()
      const appOptions: AppOptions = {
        errorMiddleware: (err: any, req: any, res: any, next?: Function) => {
          console.log('Caught Server Error ', err)
          res.status(500).json(err)
        },
        port: 3000
      }
      const server = await app.initHttpModule(adapter, appOptions)
      resolve(server)
    } catch (err) {
      reject(err)
    }
  })
}

```

### Controllers

[Api](packages/api/README.md)

### Route validator

[Fastest Validator](packages/validation/README.md)

### Files managers

[Firebase](packages/providers/uploader-firebase/README.md)

[Amazon S3](packages/providers/uploader-aws-s3/README.md)

### Authentication and rights

To manage authentication currently only JWT is available but you can add your authentication system and others will be added later

For the rights, the library [role-acl](https://github.com/tensult/role-acl) is used

#### Authentication

[JWT](/packages/strategies/strategy-jwt/README.md)

#### Rights

[Access Control List](/packages/acl/README.md)

### Database management

[Sequelize](packages/sequelize/README.md)

### Middleware customs

You can define your own middlewares, they can be called before or after the execution of the route, for the middlewares that run after the route there is no need to send the result, this can be done automatically because bubo adds itself a last middleware that returns what is in __req.result__

The middlewares are executed in the same order as they are added in the code (the highest one above the route will be executed first)

#### Before Middleware

TODO

#### After Middleware

TODO

## Editor

<p>
  <a href="https://www.owlie.xyz">
    <img style="border-radius:50%" width="100" height="100" src="https://www.owlie.xyz/bubo/owlielogo.png">
  </a>
</p>
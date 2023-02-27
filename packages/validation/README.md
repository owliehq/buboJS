<p align="center">
  <a href="https://github.com/owliehq/buboJS/tree/develop">
    <img src="https://owlie.xyz/bubo/bubo-js.png">
  </a>
</p>

## Fastest Validator ##

[![fastest validator](https://img.shields.io/npm/v/@bubojs/validation?label=validation)](https://www.npmjs.com/package/@bubojs/validation)

[Back to Main Menu](.././../README.md#route-validator)

This route validation middleware is built around [fatestValidator](https://github.com/icebob/fastest-validator) feel free to look at the documentation to learn more

### validation scheme ###

You can use the typing provided by FastestValidator<Type> which allows you to create a typed schema for fastest ex :

```ts
const userCreateValidations: FastestValidator<User> = {
    schema: {
      $$async: true,
      username: { type: 'string', min: 3, max: 255 },
      email: { type: 'email', normalize: true },
      password: this.passwordValidation,
      birthDate: {
        optional: true,
        type: 'date',
        convert: true
      },
      bio: { type: 'string', optional: true }
    },
    validatorOptions: {
      useNewCustomCheckerFunction: true, // using new version
      messages: {
        // Register our new error message text
        atLeastOneLetter: 'The pass value must contain at least one letter from a-z ranges!',
        atLeastOneUpperCaseLetter: 'The pass value must contain at least one letter from A-Z ranges!',
        atLeastOneDigit: 'The pass value must contain at least one digit from 0 to 9!',
        atLeastOneSpecialCharacter: 'The pass value must contain at least one special character!',
        emailNotAvailable: `The email is already registered!`
      }
    }
  }
```

### Adding the schema to the route ###

once the schema is created, it must be added to the route to be validated, there is a decorator for that:

```ts
import { Body, Controller, Post } from '@bubojs/api'
import { AuthMiddleware, ValidationMiddleware } from '@bubojs/catalog'

@Controller()
class AuthController {
    @ValidationMiddleware(userCreateValidations)
    @Post('/signup')
    async signup(@Body() body: any) {
        ...
    }
}
```

so the scheme is added to the route

[Back to Main Menu](.././../README.md#route-validator)

## Editor ##

<p>
  <a href="https://www.owlie.xyz">
    <img style="border-radius:50%" width="100" height="100" src="https://www.owlie.xyz/bubo/owlielogo.png">
  </a>
</p>
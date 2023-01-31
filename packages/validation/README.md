# Fastest Validator #

[Back to Main Menu](.././../README.md#validateur-de-route)

Ce middleware de validation de route est construit autours de [fatestValidator](https://github.com/icebob/fastest-validator) n'hesitez pas à regarder la documentation pour en savoir plus

## schema de validation ##

Vous pouvez utiliser le typage fournit par FastestValidator<Type> que permet de créer un schéma typé pour fastest ex :

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

## Ajout du schéma à la route ##

une fois le schéma créé il faut l'ajouter sur la route à valider, il y a un decorateur pour cela :

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

ainsi le schéma s'ajoute à la route

[Back to Main Menu](.././../README.md#validateur-de-route)

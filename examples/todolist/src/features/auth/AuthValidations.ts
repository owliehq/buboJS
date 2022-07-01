import { MetadataManager } from '@bubojs/api'
import { UsersService } from '../users/UsersService'

const usersService = MetadataManager.getServiceMetadata(UsersService)

export const checkLoginValidations = {
  schema: {
    email: { type: 'email' },
    password: { type: 'string' }
  }
}

export const createValidations = {
  schema: {
    $$async: true,
    firstName: { type: 'string', min: 3, max: 255 },
    lastName: { type: 'string', min: 3, max: 255 },
    email: {
      type: 'email',
      custom: async (v, errors) => {
        const exists = await usersService.checkEmailExistence(v)
        if (exists) errors.push({ type: 'emailNotAvailable' })

        return v
      }
    },
    password: {
      type: 'string',
      custom: async (v, errors) => {
        if (!/[0-9]/.test(v)) errors.push({ type: 'atLeastOneDigit' })
        if (!/[A-Z]/.test(v)) errors.push({ type: 'atLeastOneUpperCaseLetter' })
        if (!/[a-z]/.test(v)) errors.push({ type: 'atLeastOneLetter' })
        if (!/[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?]/.test(v)) errors.push({ type: 'atLeastOneSpecialCaracter' })

        return usersService.generatePassword(v)
      },
      min: 8,
      max: 20,
      messages: {
        stringPattern: 'pass value must contain a digit',
        stringMin: 'Your pass value is too short',
        stringMax: 'Your pass value is too large'
      }
    }
  },
  validatorOptions: {
    useNewCustomCheckerFunction: true, // using new version
    messages: {
      // Register our new error message text
      atLeastOneLetter: 'The pass value must contain at least one letter from a-z ranges!',
      atLeastOneUpperCaseLetter: 'The pass value must contain at least one letter from A-Z ranges!',
      atLeastOneDigit: 'The pass value must contain at least one digit from 0 to 9!',
      atLeastOneSpecialCaracter: 'The pass value must contain at least one special caracter!',
      emailNotAvailable: `The email is already registered!`
    }
  }
}

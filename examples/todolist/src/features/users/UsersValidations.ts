import { MetadataManager } from '@owliehq/bubojs/packages/api'
import { User } from './User'
import { UsersService } from './UsersService'

const usersService = MetadataManager.getServiceMetadata(UsersService)

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

export const updateValidations = {
  beforeValidationMiddleware: async (req: any, res: any, next: Function) => {
    try {
      const { id } = req.params
      await usersService.findUserById(id)
      next()
    } catch (error) {
      res.status(404).json({ message: error.message })
    }
  },

  schema: {
    $$async: true,
    firstName: { type: 'string', min: 3, max: 255, optional: true },
    lastName: { type: 'string', min: 3, max: 255, optional: true },
    email: {
      type: 'email',
      optional: true,
      custom: async (v, errors) => {
        //optional doesn't seem to work fine with custom
        if (v) {
          const exists = await usersService.checkEmailExistence(v)
          if (exists) errors.push({ type: 'emailNotAvailable' })
        }
        return v
      }
    },

    password: {
      type: 'string',
      custom: async (v, errors) => {
        //optional doesn't seem to work fine
        if (v) {
          if (!/[0-9]/.test(v)) errors.push({ type: 'atLeastOneDigit' })
          if (!/[A-Z]/.test(v)) errors.push({ type: 'atLeastOneUpperCaseLetter' })
          if (!/[a-z]/.test(v)) errors.push({ type: 'atLeastOneLetter' })
          if (!/[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?]/.test(v)) errors.push({ type: 'atLeastOneSpecialCaracter' })
        }

        return v
      },
      min: 8,
      max: 20,
      messages: {
        stringPattern: 'pass value must contain a digit',
        stringMin: 'Your pass value is too short',
        stringMax: 'Your pass value is too large'
      },
      optional: true
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
      emailNotAvailable: `The email is already registered!`,
      userNotFound: `The user doesn't exists!`
    }
  }
}

export const checkEmailValidations = {
  schema: {
    email: { type: 'email' }
  }
}

export const removePassword = (req, res, next) => {
  req.result.password = undefined
  next()
}

export const removePasswords = (req, res, next) => {
  req.result.map((user: User) => {
    user.password = undefined
    return user
  })
  next()
}

export const deleteValidations = async (req, res, next) => {
  try {
    const { id } = req.params
    await usersService.findUserById(id)
    next()
  } catch (error) {
    res.status(404).send(error.message)
  }
}

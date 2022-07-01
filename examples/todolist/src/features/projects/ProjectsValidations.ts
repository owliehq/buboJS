import { MetadataManager } from '@owliehq/bubojs/packages/api'
import { ProjectsService } from './ProjectsService'

const projectsService = MetadataManager.getServiceMetadata(ProjectsService)

export const createValidations = {
  schema: {
    name: { type: 'string', min: 3, max: 255 },
    description: { type: 'string', min: 3, max: 255 }
  }
}

export const updateValidations = {
  beforeValidationMiddleware: async (req: any, res: any, next: Function) => {
    try {
      const { id } = req.params
      await projectsService.findProjectById(id)
      next()
    } catch (error) {
      res.status(404).json({ message: error.message })
    }
  },
  schema: {
    name: { type: 'string', min: 3, max: 255, optional: true },
    description: { type: 'string', min: 3, max: 255, optional: true }
  }
}

export const deleteValidations = async (req, res, next) => {
  try {
    const { id } = req.params
    await projectsService.findProjectById(id)
    next()
  } catch (error) {
    res.status(404).send(error.message)
  }
}

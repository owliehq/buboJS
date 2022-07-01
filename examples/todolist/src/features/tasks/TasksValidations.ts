import { MetadataManager } from '@bubojs/api'
import { ProjectsService } from '../projects/ProjectsService'
import { TasksService } from './TasksService'

const tasksService = MetadataManager.getServiceMetadata(TasksService)
const projectsService = MetadataManager.getServiceMetadata(ProjectsService)

export const createValidations = {
  schema: {
    $$async: true,
    title: { type: 'string', min: 3, max: 255 },
    body: { type: 'string', min: 3, max: 255 },
    completion: { type: 'number', min: 0, max: 100 },
    projectId: {
      type: 'number',
      custom: async (v, errors) => {
        const project = await projectsService.findProjectById(v)

        if (!project) errors.push({ type: 'projectNotFound' })

        return v
      }
    }
  },
  validatorOptions: {
    useNewCustomCheckerFunction: true, // using new version
    messages: {
      projectNotFound: `Cannot find the project!`
    }
  }
}

export const updateValidations = {
  beforeValidationMiddleware: async (req: any, res: any, next: Function) => {
    try {
      const { id } = req.params
      await tasksService.findTaskById(id)
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
    await tasksService.findTaskById(id)
    next()
  } catch (error) {
    res.status(404).send(error.message)
  }
}

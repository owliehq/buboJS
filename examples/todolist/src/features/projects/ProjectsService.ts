import { Service } from '../../../../../packages/api/src'
import { Project } from './Project'

@Service()
export class ProjectsService {
  async findProjectById(id: string) {
    const project = await Project.findOne({ where: { id } })
    if (!project) throw new Error('Project not found')
    return project
  }
}

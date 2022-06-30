import { SequelizeBaseRepository } from '../../SequelizeBaseRepository'
import { Project } from './Project'

export class ProjectsRepository extends SequelizeBaseRepository<Project> {
  constructor() {
    super(Project)
  }
}

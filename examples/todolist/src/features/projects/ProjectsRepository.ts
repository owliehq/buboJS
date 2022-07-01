import { SequelizeBaseRepository } from '@bubojs/sequelize'
import { Project } from './Project'

export class ProjectsRepository extends SequelizeBaseRepository<Project> {
  constructor() {
    super(Project)
  }
}

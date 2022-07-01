import { SequelizeBaseRepository } from '@owliehq/bubojs/packages/sequelize'
import { Project } from './Project'

export class ProjectsRepository extends SequelizeBaseRepository<Project> {
  constructor() {
    super(Project)
  }
}

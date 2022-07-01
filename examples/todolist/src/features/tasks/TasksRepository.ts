import { SequelizeBaseRepository } from '@owliehq/bubojs/packages/sequelize'
import { Task } from './Task'

export class TasksRepository extends SequelizeBaseRepository<Task> {
  constructor() {
    super(Task)
  }
}

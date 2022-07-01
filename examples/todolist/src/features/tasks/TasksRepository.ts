import { SequelizeBaseRepository } from '@bubojs/sequelize'
import { Task } from './Task'

export class TasksRepository extends SequelizeBaseRepository<Task> {
  constructor() {
    super(Task)
  }
}

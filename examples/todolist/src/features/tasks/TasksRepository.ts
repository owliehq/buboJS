import { SequelizeBaseRepository } from '../../SequelizeBaseRepository'
import { Task } from './Task'

export class TasksRepository extends SequelizeBaseRepository<Task> {
  constructor() {
    super(Task)
  }
}

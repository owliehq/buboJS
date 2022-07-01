import { Service } from '@owliehq/bubojs/packages/api'
import { Task } from './Task'

@Service()
export class TasksService {
  async findTaskById(id: string) {
    const task = await Task.findOne({ where: { id } })
    if (!task) throw new Error('Task not found')
    return task
  }
}

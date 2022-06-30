import { Service } from '../../../../../packages/api/src'
import { Positions, UserProject } from './UserProject'

@Service()
export class UserProjectsService {
  async createUserProject(userId: number, projectId: number, position: Positions) {
    return UserProject.create({ userId, projectId, position })
  }

  async getUserProject(userId: number, projectId: number) {
    return UserProject.findOne({ where: { userId, projectId } })
  }
}

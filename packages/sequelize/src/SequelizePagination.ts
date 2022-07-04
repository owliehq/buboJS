import { FindOptions } from 'sequelize'

class SequelizePagination {
  constructor(private maxResult: number = 10) {}

  toOptions(page: number, nResults: number): Partial<FindOptions> {
    const limit = nResults > this.maxResult ? this.maxResult : nResults
    return {
      limit,
      offset: page * limit
    }
  }
}

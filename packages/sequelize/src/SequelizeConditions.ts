//interface Condition
import { IncludeOptions, Op, WhereOptions } from 'sequelize'
import isPlainObject from 'is-plain-object'

const CombinationOperator = {
  $or: [Op.or],
  $and: [Op.and]
}

const ValueOperator = {
  $eq: [Op.eq],
  $ne: [Op.ne],
  $gte: [Op.gte],
  $gt: [Op.gt],
  $lte: [Op.lte],
  $lt: [Op.lt],
  $in: [Op.in],
  $nin: [Op.notIn],
  $like: [Op.like],
  $nlike: [Op.notLike]
}

export class SequelizeConditionsParser {
  constructor() {}

  toOptions(conditions: any) {
    let result: WhereOptions<any> = {}
    if (!isPlainObject(conditions)) throw new Error('Invalid Object Conditions')
    Object.keys(conditions).forEach(c => {
      if (CombinationOperator[c] !== undefined) {
      }

      if (ValueOperator[c] !== undefined) {
      }
    })
  }
}

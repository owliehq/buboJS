export class SequelizeTypeToDefaultType {
  static convert(sequelizeType: string) {
    return sequelizeType.toLowerCase()
  }
}

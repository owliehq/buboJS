declare global {
  interface String {
    toSnakeCase(): string
  }
}
String.prototype.toSnakeCase = function (this: string) {
  return toSnakeCase(this)
}
export {} // used to force file being a module
export const toSnakeCase = (word: string) => {
  return word
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .split(' ')
    .join('_')
    .toLowerCase()
}

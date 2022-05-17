export interface MethodOptions {
  bodyFormat: BodyFormat
}

export enum BodyFormat {
  JSON = 'json',
  RAW = 'raw',
  TEXT = 'text'
}

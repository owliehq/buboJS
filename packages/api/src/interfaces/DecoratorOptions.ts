export interface MethodOptions {
  bodyFormat: BodyFormat
  rawHandler?: boolean
}

export enum BodyFormat {
  JSON = 'json',
  RAW = 'raw',
  TEXT = 'text',
  URL_ENCODED = 'urlEncoded',
  AUTO = 'auto',
  SKIP = 'skip'
}

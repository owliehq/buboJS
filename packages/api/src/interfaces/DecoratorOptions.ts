export interface MethodOptions {
  bodyFormat: BodyFormat
}

export enum BodyFormat {
  JSON = 'json',
  RAW = 'raw',
  TEXT = 'text',
  URL_ENCODED = 'urlEncoded',
  AUTO = 'auto',
  SKIP = 'skip'
}

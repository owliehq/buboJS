export interface ServerConfig {
  httpFramework: HttpFrameworkEnum
}

export enum HttpFrameworkEnum {
  FASTIFY = 'fastify',
  TINY_HTTP = 'tiny_http'
}

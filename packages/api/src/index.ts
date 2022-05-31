export * from './app'
export * from './HttpResolver'
export * from './ServiceResolver'
export * from './MetadataManager'
export * from './adapters'
export * from './decorators'
export * from './interfaces'
export * from './builder'
export * from './libs'
export * from './utils'

import { App } from './app'

export const app = new App()

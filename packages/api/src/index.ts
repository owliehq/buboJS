export * from './app'
export * from './HttpResolver'
export * from './ServiceResolver'
export * from './MetadataManager'
export * from './RightsManager'
export * from './adapters'
export * from './decorators'
export * from './interfaces'
export * from './builder'
export * from './enums'
export * from './utils'
export * from './models'

import { App } from './app'

export const app = new App()

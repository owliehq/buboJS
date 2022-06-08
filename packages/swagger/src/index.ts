export * from './DocBuilder'
export * from './MetadataConverter'
export * from './interfaces'

import { MetadataConverter } from './MetadataConverter'

import { TaskController } from '../test/mock/TaskController'
TaskController.name

const metadataConverter = new MetadataConverter()
metadataConverter.serveDoc()

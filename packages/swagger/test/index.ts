import { MetadataConverter } from '../src'
import { TaskController } from './mock/TaskController'
TaskController.name

const metadataConverter = new MetadataConverter()
metadataConverter.serveDoc()

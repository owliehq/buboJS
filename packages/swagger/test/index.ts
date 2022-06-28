import { app, MetadataManager } from '@bubojs/api'
import { TinyHttpAdapter } from '@bubojs/tinyhttp'
import { MetadataConverter } from '../src'
import { initMockDb } from './mock/models'

const metadataConverter = new MetadataConverter()

await initMockDb()
await app.initHttpModule(new TinyHttpAdapter())

app.use('/openapi', metadataConverter.serveDoc(MetadataManager.meta))

const server = app.listen(3000)

console.log('started.')

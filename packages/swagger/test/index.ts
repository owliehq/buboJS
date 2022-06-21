import { app, MetadataManager } from '@bubojs/api'
import { TinyHttpAdapter } from '@bubojs/tinyhttp'
import { MetadataConverter } from '../src'

const metadataConverter = new MetadataConverter()

await app.initHttpModule(new TinyHttpAdapter())

app.use('/openapi', metadataConverter.serveDoc(MetadataManager.meta))

const server = app.listen(3000)

console.log('started.')

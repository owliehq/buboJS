import { app } from '@bubojs/api'
import { TinyHttpAdapter } from '@bubojs/tinyhttp'
import { MetadataConverter } from '../src'

const metadataConverter = new MetadataConverter()

const server = await app.initHttpModule(new TinyHttpAdapter())
app.use('/openapi', metadataConverter.serveDoc())

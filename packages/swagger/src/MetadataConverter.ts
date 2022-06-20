import { ListMetadata, MetadataManager } from '@bubojs/api'
import { App, Request, Response } from '@tinyhttp/app'
import { readFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { DocBuilder } from './DocBuilder'
import { OpenApiJSONType } from './interfaces'

export class MetadataConverter {
  public convertController(appMetadata: ListMetadata): OpenApiJSONType {
    const docBuilder = new DocBuilder()
    return docBuilder
      .registerInfo({ title: 'api sample', version: 'v1' })
      .registerControllers(appMetadata.controllers)
      .registerModels()
      .buildDoc()
  }

  public serveDoc() {
    const docs = this.convertController(MetadataManager.meta)
    const strDocs = JSON.stringify(docs)

    const modulePath = fileURLToPath(import.meta.url)
    const __dirname = dirname(modulePath)

    const template = readFileSync(resolve(__dirname, 'template.html'), 'utf8')
    const html = template.replace('"##docs##"', strDocs).replace('"##title##"', 'api sample test')

    const fn = (_req: Request, res: Response) => {
      res.status(200).send(html)
    }

    return fn
  }
}

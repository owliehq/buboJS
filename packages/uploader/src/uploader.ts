import { Readable } from 'stream'
import { default as busboy } from 'busboy'
import { foid } from './utils/index.js'
import { ErrorFactory } from '@bubojs/http-errors'
import * as mime from 'mime-types'

export abstract class Uploader {
  constructor() {}

  /**
   * create middleware handler to manage uploading file or field
   */
  public get middleware() {
    const handler = (req: any, res: any, next: any) => {
      const busboyObject = busboy({ headers: req.headers })
      req.body = {}
      busboyObject.on('file', (fieldname: string, file: Readable, { filename, encoding, mimeType }) => {
        const key = this.onFileUploadHandler(fieldname, file, filename, encoding, mimeType)

        file.on('end', () => {
          req.body[fieldname] = key
        })
      })

      busboyObject.on('field', (key, value) => {
        req.body[key] = value
      })

      busboyObject.on('finish', next)

      req.body = req.body || {}

      req.pipe(busboyObject)
    }

    return handler
  }

  /**
   * create middleware handler to download a file
   * @param options
   * @returns
   */
  public buildDownloadEndpoint(options: DownloadEndpointOptions) {
    const handler = async (req: any, res: any) => {
      const key = await options.retrieveKeyCallback(req)

      if (!key) throw ErrorFactory.NotFound()

      const { cache, contentType } = options

      if (cache && Object.keys(cache).length) {
        cache.maxAge = cache.maxAge || 86400

        res.set('Cache-Control', `public, max-age=${cache.maxAge}`)
        res.set('Expires', new Date(Date.now() + cache.maxAge).toUTCString())
      }

      const contentTypeHeader = contentType || mime.lookup(options?.filename || key)
      res.set({ 'Content-Type': contentTypeHeader })

      const promise = () =>
        new Promise(async (resolve, reject) => {
          const stream = await this.getStreamFile(key)

          stream.on('error', (err: any) => {
            if (err.code === 404) return reject(ErrorFactory.NotFound())
            reject(ErrorFactory.InternalServerError())
          })

          stream.on('finish', () => resolve(void 0))

          stream.pipe(res)
        })

      try {
        await promise()
      } catch (err) {
        console.log('An error has occured during downloading file...')
        throw ErrorFactory.UnprocessableEntity()
      }
    }

    return handler
  }

  public buildDeleteEndpoint(options: DeleteEndpointOptions) {
    const handler = async (req: any, res: any, next: any) => {
      const key = await options.retrieveKeyCallback(req)

      if (!key) throw ErrorFactory.NotFound()

      const promise = () =>
        new Promise((resolve, reject) => {
          this.onFileDeleteHandler(key)
            .then(() => {
              resolve({})
            })
            .catch(err => {
              reject(ErrorFactory.InternalServerError())
            })
        })

      try {
        await promise()
        next()
      } catch (err) {
        console.log('An error has occured during deleting file...')
        throw ErrorFactory.UnprocessableEntity()
      }
    }

    return handler
  }

  /**
   * abstract to create handler when uploading file
   * @param fieldname
   * @param file
   * @param filename
   * @param encoding
   * @param mimetype
   */
  abstract onFileUploadHandler(
    fieldname: string,
    file: Readable,
    filename: string,
    encoding: string,
    mimetype: string
  ): string

  /**
   * abstract to get file stream
   * @param key filename
   */
  abstract getStreamFile(key: string): Promise<Readable>

  /**
   * abstract to delete file
   */
  abstract onFileDeleteHandler(key: string): Promise<any>

  /**
   * generate a random key
   */
  protected generateKey() {
    return foid(18)
  }
}

/**
 * options to create download endpoint
 */
export interface DownloadEndpointOptions {
  filename?: string
  contentType?: string
  cache?: {
    maxAge?: number
  }
  retrieveKeyCallback(id: any): Promise<string | undefined>
}

export interface DeleteEndpointOptions {
  filename?: string
  retrieveKeyCallback(id: any): Promise<string | undefined>
}

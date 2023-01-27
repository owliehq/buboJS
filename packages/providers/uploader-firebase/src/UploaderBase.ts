// @ts-ignore
import { default as busboy } from 'busboy'
import { Writable, Readable } from 'node:stream'
import { nanoid } from 'nanoid'
import { ErrorFactory } from '@bubojs/http-errors'
import { FirebaseUploaderOpt } from './FirebaseUploader'
import * as mime from 'mime-types'

export interface DownloadEndpointOptions {
  filename?: string
  contentType?: string
  cache?: {
    maxAge?: number
  }
  retrieveKeyCallback(req: any): Promise<string | undefined>
}

export abstract class UploaderBase {
  abstract uploadMiddleware(
    options: FirebaseUploaderOpt,
    authorizedFields: Array<string>,
    authorizedExtensions: Array<string>
  ): (res: any, req: any, next: Function) => void
  protected abstract downloadStream(key: string): Readable
  public abstract delete(key: string): Promise<void>

  public buildDownloadEndpoint(options: DownloadEndpointOptions) {
    const handler = async (req: any, res: any) => {
      const key = await options.retrieveKeyCallback(req)
      if (!key) throw ErrorFactory.NotFound('File')
      const { cache, contentType } = options
      if (cache && Object.keys(cache).length) {
        cache.maxAge = cache.maxAge || 86400
        res.set('Cache-Control', `public, max-age=${cache.maxAge}`)
        res.setHeader('Expires', new Date(Date.now() + cache.maxAge).toUTCString())
      }
      if (contentType) {
        res.set({ 'Content-Type': contentType })
      } else {
        // TODO: Better handling needed here
        res.attachment(options?.filename || key)
      }

      const promise = () =>
        new Promise((resolve, reject) => {
          const stream = this.downloadStream(key)

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
        console.log(err)
        throw ErrorFactory.UnprocessableEntity()
      }
    }

    return handler
  }
  protected uploadMiddlewareBuilder(
    streamBuilder: (
      originalName: string,
      mimetype: string,
      generatedName?: string
    ) => { key: string; uploadStream: Writable },
    authorizedFields: Array<string>,
    authorizedExtensions: Array<string>
  ) {
    return (req: any, res: any, next: Function) => {
      const bb = busboy({ headers: req.headers })
      req.body = {}
      bb.on('file', (fieldName: any, file: Readable, info: any) => {
        const { filename, encoding, mimeType } = info
        if (!authorizedFields.includes(fieldName)) {
          console.log('wrong FileName', fieldName)
          next(ErrorFactory.UnprocessableEntity('too much parameters'))
          return
        }
        const extension = mime.extension(mimeType) || ''
        if (!authorizedExtensions.includes(extension)) {
          next(ErrorFactory.UnprocessableEntity(`Unauthorized file type ${extension}`))
          return
        }
        const { uploadStream, key } = streamBuilder(filename, mimeType, nanoid())
        file.on('end', () => {
          req.body[fieldName] = key
          if (req.$uploadedFilesKeys) {
            req.$uploadedFilesKeys.push(key)
          } else {
            req.$uploadedFilesKeys = [key]
          }
        })
        file.pipe(uploadStream)
      })
      bb.on('field', (name: any, val: any, info: any) => {
        if (authorizedFields.includes(name)) {
          req.body[name] = val
        }
      })
      bb.on('finish', next as { (): void })
      req.pipe(bb)
    }
  }

  protected getExtension(fullName: string) {
    return fullName.split('.').pop() || ''
  }
}

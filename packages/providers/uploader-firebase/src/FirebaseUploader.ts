import * as mime from 'mime-types'
import { UploaderBase } from './UploaderBase.js'
import { Readable } from 'node:stream'
import { FirebaseInstance } from './FirebaseInstance.js'

export interface FirebaseUploaderOpt {
  folder: string
  keepName: boolean
  preserveExtension: boolean
}

export class FirebaseUploader extends UploaderBase {
  private readonly $bucket

  constructor(instance: FirebaseInstance, bucketId: string) {
    super()
    try {
      this.$bucket = instance.bucket(bucketId)
      if (this.$bucket === undefined) {
        throw new Error('Bucket undefined')
      }
    } catch (error) {
      console.log('Error when starting connecting to Google Cloud Storage', error)
    }
  }

  uploadMiddleware(
    options: FirebaseUploaderOpt,
    authorizedFields: Array<string>,
    authorizedExtensions: Array<string>
  ): (res: any, req: any, next: Function) => void {
    return super.uploadMiddlewareBuilder(this.buildUploadStream(options), authorizedFields, authorizedExtensions)
  }

  protected downloadStream(key: string): Readable {
    return this.$bucket!.file(key).createReadStream()
  }

  public async delete(key: string) {
    const file = await this.$bucket!.file(key)
    await file.delete()
  }

  private buildUploadStream(options?: FirebaseUploaderOpt) {
    /* generatedName is a workaround to get nanoid with fileUpload handler in formidable which do not take promise */
    return (originalName: string, mimetype: string, generatedName?: string) => {
      const extension = mime.extension(mimetype)
      const name = !options?.keepName && generatedName ? generatedName : originalName
      const folder = options?.folder ? `${options?.folder}/` : ''
      const key = `${folder}${name}${options?.preserveExtension ? `.${extension}` : ''}`
      const $file = this.$bucket!.file(key)
      let uploadStream = $file.createWriteStream({
        metadata: {
          contentType: mimetype
        }
      })
      return { key, uploadStream }
    }
  }
}

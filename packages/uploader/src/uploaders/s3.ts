import { Readable } from 'stream'
import { Uploader } from '../uploader.js'
import * as mime from 'mime-types'

export class S3Uploader extends Uploader {
  private bucket: any
  private bucketName: string
  private folderName: string

  constructor(options: S3Options) {
    super()
    this.bucket = options.bucket
    this.bucketName = options.bucketName
    this.folderName = options.folderName
  }

  /**
   * upload file on s3 bucket
   * @param fieldname not used
   * @param file file to upload
   * @param filename not used
   * @param encoding not used
   * @param mimetype mimetype of file
   */
  public onFileUploadHandler(
    fieldname: string,
    file: Readable,
    filename: string,
    encoding: string,
    mimetype: string
  ): string {
    const extension = mime.extension(mimetype)

    const key = `${this.generateKey().toString()}.${extension}`

    const params = {
      Bucket: this.bucketName,
      Key: `${this.folderName}/${key}`,
      Body: file
    }

    const data = this.bucket.putObject(params, (err: any, data: any) => {
      if (err) console.log('err', err)
    })

    return key
  }

  /**
   * get file stream
   * @param key filename
   */
  public async getStreamFile(key: string): Promise<Readable> {
    const params = {
      Bucket: this.bucketName,
      Key: `${this.folderName}/${key}`
    }

    const object = await this.bucket.getObject(params)

    const stream = new Readable()
    stream.push(await object.Body?.transformToByteArray())
    stream.push(null) //signal EOF of buffer
    return stream
  }

  /**
   * delete file on s3
   */
  public onFileDeleteHandler(key: string): Promise<any> {
    const params = {
      Bucket: this.bucketName,
      Key: `${this.folderName}/${key}`
    }
    return this.bucket.deleteObject(params)
  }
}

export interface S3Options {
  bucket: any
  bucketName: string
  folderName: string
}

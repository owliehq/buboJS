# Amazon S3

[Back To Main Menu](../../../README.md#files-managers)

This uploader allows you to use AWS S3 protocol.

## Storage Instance

declaration of a client instance [AWS S3 version 3](https://www.npmjs.com/package/@aws-sdk/client-s3)

```ts
import { S3 } from '@aws-sdk/client-s3';
import { S3Uploader } from '@bubojs/uploader-aws-s3';

const s3Bucket = new S3({
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  region: process.env.S3_REGION,
});

export const uploader = new S3Uploader({
  bucket: s3Bucket,
  bucketName: process.env.S3_BUCKET_NAME,
  folderName: process.env.S3_FOLDER_NAME,
});
```

## Example of a controller using the uploader

This example uses the 3 functions of the S3 uploader.

```ts
import { uploader } from './config'
import { Controller, BeforeMiddleware, Post, Body } from '@bubojs/api'

@Controller()
class TestController {

  /**
   * upload route with form-data body
   * Body: {
   *  file: 📄
   * }
   */
  @BeforeMiddleware(
    uploader.buildUploadEndpoint({ authorizedExtensions: ['jpeg', 'png']})
  )
  @Post('/')
  async uploadRoute(@Body('file') filename: string) {
    console.log('uploaded file')
    return {}
  }

  /**
   * download route
   * Params: {
   *  key: 'filename.jpeg'
   * }
   */
  @Get(':key', { bodyFormat: BodyFormat.AUTO, rawHandler: true })
  downloadRoute() {
    return uploader.buildDownloadEndpoint({
      retrieveKeyCallback: async (req: any) => {
        return req.params.key;
      },
    });
  }

  /**
   * download route
   * Params: {
   *  key: 'filename.jpeg'
   * }
   */
  @Delete(':key', { rawHandler: true })
  deleteRoute() {
    return uploader.buildDeleteEndpoint({
      retrieveKeyCallback: async (req: any) => {
        return req.params.key;
      },
    });
  }
```

### buildUploadEndpoint

To save a file, the __buildUploadEndpoint__ function is used as the middleware of the route. The file is uploaded using the S3 client on the AWS servers. Once the file is online, we replace the file in the body object with the file name with its file extension.
It is possible to add these options:

* authorizedExtensions => Array\<string> - uses the mimeType to detect the file extension and only allows those among the text array.
* authorizedFileFields => Array\<string> - checks if the files are among the authorized body fields

### buildDownloadEndpoint

The function allows to create a file download route, we use the rawHandler option in our custom route to be able to pass the constructor of the download endpoint

Options:

* retrieveKeyCallback => Function(req: any) => string - function that retrieves the file name from the req object of the request
* *optional* filename => string - name of the file
* *optional* contentType => string - contentType of the header response
* *optional* cache.maxAge => number - cache option on the Cache-Control in the header

### buildDeleteEndpoint

The function allows you to delete the file

Options:

* retrieveKeyCallback => Function(req: any) => string - function that retrieves the name of the file from the req object of the request
* *optional* filename => string - name of the file

[Back To Main Menu](../../../README.md#files-managers)

# BuboJS uploader

## Install

This module is available through the npm registry

with npm

```sh
npm i @bubojs/uploader
```

or yarn

```sh
yarn add @bubojs/uploader
```

## Features

* Create middleware to uploading file
  * Whitelist file extension to upload
* Create middleware to download file
* Create middleware to delete file

## Supports

* [AWS S3 version 3](https://www.npmjs.com/package/@aws-sdk/client-s3)

## Quick start

It is recommanded to use this module with [@bubojs/api](https://www.npmjs.com/package/@bubojs/api) with this [documentation](https://github.com/owliehq/buboJS) for a quick start

### AWS S3 example

Configure the config file :

```ts
import { S3 } from '@aws-sdk/client-s3';
import { S3Uploader } from '@bubojs/uploader';

export const s3Bucket = new S3({
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

Then use the object uploader functions as a middleware of your routes :

```ts
import { uploader } from './config'
import { Controller, BeforeMiddleware, Post } from '@bubojs/api'

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
  async uploadRoute() {
    console.log('uploaded files')
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

## Functions

### buildUploadEndpoint

Create middleware to upload file online

Options:

* authorizedExtensions => Array\<string> - use mimeType to detect if file is from those extension
* authorizedFileFields => Array\<string> - check if file is on correct field of body, without this option any file from the body is uploaded

### buildDownloadEndpoint

Create middleware to download file online, file is send with [Readable.pipe](https://nodejs.org/api/stream.html#readablepipedestination-options) function on response object

Options:

* retrieveKeyCallback => Function(req: any) => string - function to retrieve the filename from the req object
* *optional* filename => string - filename of the file
* *optional* contentType => string - contentType header of the response
* *optional* cache.maxAge => number - cache option for Cache-Control header

### buildDeleteEndpoint

Create middleware to delete file online

Options:

* retrieveKeyCallback => Function(req: any) => string - function to retrieve the filename from the req object
* *optional* filename => string - filename of the file

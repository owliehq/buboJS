<p align="center">
  <a href="https://github.com/owliehq/buboJS/tree/develop">
    <img src="https://owlie.xyz/bubo/bubo-js.png">
  </a>
</p>

## Firebase ##

[![uploader-firebase](https://img.shields.io/npm/v/@bubojs/uploader-firebase?label=uploader-firebase)](https://www.npmjs.com/package/@bubojs/uploader-firebase)

[Back To Main Menu](../../../README.md#files-managers)

This uploader allows you to use Firebase Storage

### Storage Instance ###

declaration of a storage instance (only one per project needed but you can add as many as you need)

```ts
import { FirebaseInstance } from '../bubo.middlewares/uploader/Firebase'
import { env } from './constants'

export const firebase = new FirebaseInstance({
  privateKey: env.FIREBASE.privateKey,
  clientEmail: env.FIREBASE.clientEmail,
  projectId: env.FIREBASE.projectId
})
```

### Place the uploader on a route ###

```ts
import { Upload } from '@bubojs/uploader-firebase'
import { firebase } from '../../config/Firebase'
import { Controller, DefaultActions, BeforeMiddleware, Post } from '@bubojs/api'

@Controller()
class TestController {

  @Upload(
    firebase,
    { folder: 'test_folder', keepName: false, preserveExtension: true },
    ['fieldOne', 'fieldTwo'],
    ['jpeg', 'png']
  )
  @Post('/')
  async testRoute() {
    console.log('uploaded files')
    return {}
  }

```

the Upload Middleware takes arguments :

1. the storage instance that provides the functions needed to access the storage
2. a list of storage specific options:
    - folder allows to define a virtual folder to store the data
    - keepName allows to keep the original name of the file or to generate one with nanoid
    - preserveExtension allows to keep the original extension of the file or not to set an extension
3. the third argument allows to define the authorized field names, if others are provided the request is refused and an error is raised
4. the fourth argument defines the list of allowed extensions, if an extension is not conform the request is refused and an error is raised

once the upload is done the firebase key of the uploaded file is stored in the field that contained the file in the req.body, the other fields are simply copied in the req.body

### Download the file ###

the uploader instance (firebase here) provides a download route, we use the rawHandler option in our custom route to pass the constructor of the download endpoint
then we return from our builder function the result of firebaseInstance.buildDownloadEndpoint.

The function takes two parameters:
-> the cache with maxAge that is sent to the response header during the download
-> retrieveKeyCallback which defines the function to retrieve the firebase key based on what is passed in the request

```ts
@Get(':id/image', { rawHandler: true, bodyFormat: BodyFormat.AUTO })
  dowloadImageBuilder() {
    return firebase.buildDownloadEndpoint({
      cache: { maxAge: 4 },
      retrieveKeyCallback: async (req: any) => {
        const img = await image.findOneByNoThrow('id', req.params.id)
        return image.fileKey
      }
    })
  }
```

[Back To Main Menu](../../../README.md#files-managers)

## Editor ##

<p>
  <a href="https://www.owlie.xyz">
    <img style="border-radius:50%" width="100" height="100" src="https://www.owlie.xyz/bubo/owlielogo.png">
  </a>
</p>

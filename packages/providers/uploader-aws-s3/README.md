# Amazon S3 #

[Back To Main Menu](../../../README.md)

Cet uploader permet d'utiliser Firebase Storage

## Instance de Storage ##

déclaration d'une instance d'un client [AWS S3 version 3](https://www.npmjs.com/package/@aws-sdk/client-s3)

```ts
import { S3 } from '@aws-sdk/client-s3';
import { S3Uploader } from '@bubojs/uploader';

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

## Exemple d'un contrôleur qui utilise l'uploader ##

Cet exemple utilise les 3 fonctions de l'uploader S3.

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

### buildUploadEndpoint ###

Pour enregistrer un fichier, on utilise la fonction __buildUploadEndpoint__ en tant que middleware de la route. Le fichier est envoyé à l'aide du client S3 sur les serveurs AWS. Une fois le fichier en ligne, on remplace le fichier dans l'objet body par le nom du fichier avec son extension de fichier.
Il est possible de rajouter ces options:

* authorizedExtensions => Array\<string> - utilise le mimeType pour détecter l'extension du fichier et n'autorise que ceux parmi le tableau de texte
* authorizedFileFields => Array\<string> - vérifie si les fichiers sont parmi les champs du body autorisés

### buildDownloadEndpoint ###

La fonction permet de créer une route de téléchargement de fichier, on utilise l'option rawHandler dans notre route custom pour pouvoir passer le constructeur du endpoint de téléchargement

Options:

* retrieveKeyCallback => Function(req: any) => string - fonction qui récupère le nom du fichier dans l'objet req de la requête
* *optional* filename => string - nom du fichier
* *optional* contentType => string - contentType de la réponse du header
* *optional* cache.maxAge => number - option du cache sur le Cache-Control dans le header

### buildDeleteEndpoint ###

La fonction permet de supprimer le fichier en ligne

Options:

* retrieveKeyCallback => Function(req: any) => string - fonction qui récupère le nom du fichier dans l'objet req de la requête
* *optional* filename => string - nom du fichier

[Back To Main Menu](../../../README.md)

# Google Cloud Storage #

[Back To Main Menu](../../../README.md)

Cet uploader permet d'utiliser Google Cloud Storage

## Instance de Storage ##

declaration d'une instance de storage (une seule par projet necessaire mais vous pouvez en ajouter autant que de besoin)

```ts
import { FirebaseInstance } from '../bubo.middlewares/uploader/Firebase'
import { env } from './constants'

export const firebase = new FirebaseInstance({
  bucketId: env.FIREBASE.bucketId,
  privateKey: env.FIREBASE.privateKey,
  clientEmail: env.FIREBASE.clientEmail,
  projectId: env.FIREBASE.projectId
})
```

## Placer l'uploader sur une route ##

```ts
import { Upload } from '../../bubo.middlewares/uploader'
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

le Middleware Upload prend arguments :

1. l'instance de storage qui fournit les fonctions necessaires à l'accès au stockage
2. une liste d'options propres au storage:
    - folder permet de definir un dossier virtuel pour stocker les données
    - keepName permet de garder le nom d'origine du fichier ou d'en generer un avec nanoid
    - preserveExtension permet de conserver l'extension d'origine du fichier ou de ne pas mettre d'extension
3. le troisième argument permet de definir les noms de champs autorisés, si d'autres sont fournis la requete est refusée et une erreur est levée
4. le quatrieme argument definit la liste des extensions autorisées, si une extension n'est pas conforme la requete est refusée et part en erreur

une fois l'upload fait la clef de firebase du fichier uploadé est stocké dans le champ qui contenait le fichier dans le req.body, les autres champs sont copiés simplement dans le req.body

## Download le fichier ##

l'instance de l'uploader (firebase ici) prevoit une route de download, on utilise l'option rawHandler dans notre route custom pour pouvoir passer le constructeur du endpoint de telechargement
on renvoie ensuite depuis notre fonction builder le resultat de firebaseInstance.buildDownloadEndpoint.

La fonction prends deux parametres :
-> le cache avec maxAge qui est envoyé au header de reponse lors du telechargement
-> retrieveKeyCallback qui definit la fonction permettant de recupérer la clef firebase en fonction de ce qui est passé dans la requete

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

[Back To Main Menu](../../../README.md)
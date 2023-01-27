import { default as admin, ServiceAccount, messaging } from 'firebase-admin'

export interface FirebaseCredentials {
  projectId: string
  privateKey: string
  clientEmail: string
}

export class FirebaseInstance {
  app: admin.app.App
  constructor(credentials: FirebaseCredentials) {
    const serviceAccount: ServiceAccount = {
      privateKey: credentials.privateKey!.replace(/\\n/gm, '\n'),
      clientEmail: credentials.clientEmail!,
      projectId: credentials.projectId!
    }
    this.app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    })
  }

  bucket(bucketId: string) {
    return this.app.storage().bucket(bucketId)
  }

  messaging(): messaging.Messaging {
    return this.app.messaging()
  }
}

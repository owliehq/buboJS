import { FirebaseUploader, FirebaseUploaderOpt } from './FirebaseUploader.js'
import { MetadataManager, MiddlewarePosition } from '@bubojs/api'

export const Upload =
  (
    StorageInstance: FirebaseUploader,
    options: FirebaseUploaderOpt,
    authorizedFields: Array<string>,
    authorizedTypes: Array<string>
  ) =>
  (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    MetadataManager.setMiddlewareMetadata(
      target.constructor.name,
      propertyKey,
      MiddlewarePosition.BEFORE,
      StorageInstance.uploadMiddleware(options, authorizedFields, authorizedTypes)
    )
  }

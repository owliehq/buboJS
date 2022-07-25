import { BeforeMiddleware, HeaderType, MetadataManager } from '@bubojs/api'

export const authMiddleware = (req, res, next): void => {
  if (!req.user) {
    res.status(401).json({ message: `Unauthorized Access, token must be provided.` })
  } else {
    next()
  }
}

export const AuthMiddleware = () => {
  return BeforeMiddleware(authMiddleware)
}

export const CurrentUser = (target: any, propertyKey: string, index: number) => {
  MetadataManager.setParameterMetadata(target.constructor.name, propertyKey, index, {
    getValue: (req: any) => {
      return req.user
    },
    headerType: HeaderType.BODY
  })
}

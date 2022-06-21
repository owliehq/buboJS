import { BeforeMiddleware } from '@bubojs/api'

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

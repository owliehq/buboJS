import jsonwebtoken from 'jsonwebtoken'
import { Transaction } from 'sequelize/types'
import { Service } from '../../../../packages/api/src'
import { ACCESS_TOKEN_DURATION, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../config/constants'
import { RefreshToken } from '../features/auth/RefreshToken'

@Service()
export class TokenService {
  /**
   *
   * @param payload
   */
  createAccessToken(payload: any): string {
    return jsonwebtoken.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_DURATION
    })
  }

  /**
   *
   * @param payload
   */
  createPasswordToken(payload: any): string {
    return jsonwebtoken.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: 60 * 60 * 48
    })
  }

  /**
   *
   * @param token
   * @param secret
   */
  async verifyToken(token: string, secret: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jsonwebtoken.verify(token, secret, (err, content) => {
        if (err) return reject(err)
        resolve(content)
      })
    })
  }

  /**
   *
   */
  async createRefreshToken(type: string, userId: number, transaction?: Transaction) {
    const payload = {
      type,
      userId
    }

    const refreshToken = jsonwebtoken.sign(payload, REFRESH_TOKEN_SECRET)

    await RefreshToken.create({ content: refreshToken }, { transaction })

    return refreshToken
  }

  /**
   *
   */
  decodeToken(token: string) {
    return jsonwebtoken.decode(token)
  }
}

import { Request, Response, NextFunction } from 'express'
import { verify, decode } from 'jsonwebtoken'
import configAuth from '../../config/config'
import { User } from '../models/user'
import { generateToken, responseWithToken } from '../helpers'
import { notFound, serverError } from '../errors'

interface Decoded {
  id: string
  iat: number
  exp: number
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeaders = req.header('Authorization')
  if (!authHeaders) return res.status(401).json(responseWithToken(notFound('Token')))

  try {
    // Validate token
    const decoded = verify(authHeaders, configAuth.secret) as Decoded
    req.userId = decoded.id

    return next()
  } catch (error) {
    try {
      const tokenDecoded = decode(authHeaders) as Decoded
      const user = await User.findById(tokenDecoded.id)

      // Remenber user
      if (user && user.rememberMe === true) {
        req.newToken = generateToken(user.id)

        const decoded = decode(req.newToken) as Decoded
        req.userId = decoded.id

        return next()
      }

      return res.status(401).json(responseWithToken('Token inválido'))
    } catch (error) {
      return res.status(500).json(serverError())
    }
  }
}

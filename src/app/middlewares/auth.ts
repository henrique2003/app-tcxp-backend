import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'
import configAuth from '../../config/config'

interface Decoded {
  id: string
  iat: number
  exp: number
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeaders = req.header('Authorization')

  if (!authHeaders) return res.status(401).json('Token não encontrado')

  try {
    const decoded = verify(authHeaders, configAuth.secret) as Decoded
    req.userId = decoded.id

    next()
  } catch (error) {
    return res.status(401).json('Token inválido')
  }
}

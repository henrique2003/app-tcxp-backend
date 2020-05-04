import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'
import { secret } from '../../config/auth.json'

interface Payload {
  id: string
  iat: number
  exp: number
}

const auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeaders = req.header('Authorization')

  if (!authHeaders) return res.status(401).json('Token não encontrado')

  try {
    const decoded = verify(authHeaders, secret) as Payload
    req.userId = decoded.id

    next()
  } catch (error) {
    return res.status(401).json('Token inválido')
  }
}

export default auth

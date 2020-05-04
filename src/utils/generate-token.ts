import { sign } from 'jsonwebtoken'
import config from '../config/configAuth'

export const generateToken = (id: string): string => {
  return sign({ id }, config.secret, { expiresIn: 86400 })
}

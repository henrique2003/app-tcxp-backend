import { sign } from 'jsonwebtoken'
import config from '../../config/config'

export const generateToken = (id: string): string => {
  return sign({ id }, config.secret, { expiresIn: 86400 })
}
